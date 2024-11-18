import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';


const PlaceOrder = ({ selectedCurrency, onSuccess }) => {
  const [orderType, setOrderType] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { authToken, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchWallets = async () => {
      if (!authToken) return;

      try {
        const response = await axios.get('http://localhost:5000/wallets', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log(response);
      } catch (error) {
        console.error('Failed to fetch wallets:', error);
      }
    };

    fetchWallets();
  }, [authToken]);

  const handlePlaceOrder = async () => {
    setLoading(true);
    setMessage('');

    if (!authToken) {
      setMessage('You need to be logged in to perform this action.');
      setLoading(false);
      logout();
      return;
    }

    try {
      console.log(selectedCurrency);
      await axios.post(
        'http://localhost:5000/order',
        {
          order_type: orderType,
          currency: selectedCurrency.toUpperCase(),
          base_currency: 'USDT', // Always USDT
          quantity: parseFloat(quantity),
          price: parseFloat(price),
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setMessage('Order placed successfully!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-10 flex justify-center items-center">
      <div className="p-8 max-w-md w-full">
        {message && (
          <p
            className={`text-center mb-4 ${
              message.includes('success') ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Order Type</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded"
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            placeholder="Amount"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Price (in USDT)</label>
          <input
            type="number"
            placeholder="Price per unit"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded"
          />
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className={`w-full ${
            loading ? 'bg-blue-300' : 'bg-blue-500'
          } text-white p-2 rounded hover:bg-blue-600`}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default PlaceOrder;
