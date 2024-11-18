import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderBook = ({ selectedCurrency }) => {
  const [buyOrders, setBuyOrders] = useState([]);
  const [sellOrders, setSellOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://85.208.87.192:5001/orderbook');
        const filteredBuyOrders = response.data.buy_orders.filter(
          (order) => order.currency === selectedCurrency
        );
        const filteredSellOrders = response.data.sell_orders.filter(
          (order) => order.currency === selectedCurrency
        );
        setBuyOrders(filteredBuyOrders);
        setSellOrders(filteredSellOrders);
      } catch (error) {
        console.error('Error fetching order book:', error);
      }
    };

    fetchOrders();

    const intervalId = setInterval(fetchOrders, 3000);

    return () => clearInterval(intervalId);
  }, [selectedCurrency]);

  return (
    <div className="p-8 w-full mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 p-4 border-r border-gray-300">
          <h3 className="text-xl font-bold mb-4 text-green-500">Buy Orders</h3>
          <div className="h-80 bg-green-100 rounded p-4 shadow-inner overflow-y-auto">
            <table className="table-fixed w-full border-collapse">
              <thead className="sticky top-0 bg-green-200">
                <tr className="text-left text-gray-700">
                  <th className="p-1 w-20 text-center">User ID</th>
                  <th className="p-1 text-center">Currency</th>
                  <th className="p-1">Price (USDT)</th>
                  <th className="p-1">Quantity</th>
                  <th className="p-1">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {buyOrders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-1 text-center">{order.user_id}</td>
                    <td className="p-1 text-center">{order.currency}</td>
                    <td className="p-1">{order.price}</td>
                    <td className="p-1">{order.quantity}</td>
                    <td className="p-1">{new Date(order.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-4">
          <h3 className="text-xl font-bold mb-4 text-red-500">Sell Orders</h3>
          <div className="h-80 bg-red-100 rounded p-4 shadow-inner overflow-y-auto">
            <table className="table-fixed w-full border-collapse">
              <thead className="sticky top-0 bg-red-200">
                <tr className="text-left text-gray-700">
                  <th className="p-1 w-20 text-center">User ID</th>
                  <th className="p-1 text-center">Currency</th>
                  <th className="p-1">Price (USDT)</th>
                  <th className="p-1">Quantity</th>
                  <th className="p-1">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {sellOrders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-1 text-center">{order.user_id}</td>
                    <td className="p-1 text-center">{order.currency}</td>
                    <td className="p-1">{order.price}</td>
                    <td className="p-1">{order.quantity}</td>
                    <td className="p-1">{new Date(order.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
