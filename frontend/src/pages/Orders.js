import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import OrderBook from '../components/Orders/OrderBook';
import PlaceOrder from '../components/Orders/PlaceOrder';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [errorOrders, setErrorOrders] = useState('');
    const [errorHistory, setErrorHistory] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState("BTC");
    const { authToken, logout } = useContext(AuthContext);
    const currencies = ["BTC", "ETH", "TON", "TRX"];

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://85.208.87.192:5001/orders', {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                const filteredOrders = response.data.filter(order => order.currency === selectedCurrency);
                setOrders(filteredOrders);
            } catch (err) {
                setErrorOrders('Failed to load orders.');
                logout();
            } finally {
                setLoadingOrders(false);
            }
        };

        const fetchTransactionHistory = async () => {
            try {
                const response = await axios.get('http://85.208.87.192:5001/transactions', {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                const filteredTransactions = response.data.filter(transaction => transaction.currency === selectedCurrency);
                setTransactionHistory(filteredTransactions);
                console.log(transactionHistory);
            } catch (err) {
                setErrorHistory('Failed to load transaction history.');
                logout();
            } finally {
                setLoadingHistory(false);
            }
        };

        fetchOrders();
        fetchTransactionHistory();
    }, [authToken, selectedCurrency]);

    const handleDeleteOrder = async (orderId) => {
        try {
            await axios.delete(`http://85.208.87.192:5001/order/${orderId}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setOrders(orders.filter((order) => order.id !== orderId));
        } catch (err) {
            console.error('Failed to delete order:', err);
        }
    };

    return (
        <div className="p-10 min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-center mb-10 text-blue-600">Orders</h1>

            {/* Currency Selector */}
            <div className="mb-6 text-center">
                <label htmlFor="currency-selector" className="text-lg font-semibold mr-4">Select Currency:</label>
                <select
                    id="currency-selector"
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="p-2 border rounded shadow-sm"
                >
                    {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                    ))}
                </select>
            </div>

            {/* Order Book and Place Order Section */}
            <div className="flex gap-8">
                <div className="max-w-[70%] bg-white p-6 rounded shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Order Book</h2>
                    <OrderBook selectedCurrency={selectedCurrency} />
                </div>
                <div className="min-w-[30%] bg-white p-6 rounded shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Place New Order</h2>
                    <PlaceOrder selectedCurrency={selectedCurrency} onSuccess={() => window.location.reload()} />
                </div>
            </div>

            {/* My Orders Section */}
            <div className="bg-white p-6 rounded shadow-md mt-8">
                <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
                {loadingOrders ? (
                    <p className="text-center">Loading...</p>
                ) : errorOrders ? (
                    <p className="text-center text-red-500">{errorOrders}</p>
                ) : orders.length === 0 ? (
                    <p>No orders available.</p>
                ) : (
                    <div className="overflow-auto">
                        <table className="w-full bg-gray-100 rounded-md shadow-md">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2">Type</th>
                                    <th className="px-4 py-2">Currency</th>
                                    <th className="px-4 py-2">Quantity</th>
                                    <th className="px-4 py-2">Price</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-b hover:bg-gray-100">
                                        <td className="px-4 py-2 text-center">{order.order_type}</td>
                                        <td className="px-4 py-2 text-center">{order.currency}</td>
                                        <td className="px-4 py-2 text-center">{order.quantity}</td>
                                        <td className="px-4 py-2 text-center">{order.price}</td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                onClick={() => handleDeleteOrder(order.id)}
                                                className="text-red-500 underline hover:text-red-700"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Transaction History Section */}
            <div className="bg-white p-6 rounded shadow-md mt-8">
                <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
                <h3 className="text-xl font-semibold mb-4">Receive a prize on each 10th transaction!</h3>
                {loadingHistory ? (
                    <p className="text-center">Loading...</p>
                ) : errorHistory ? (
                    <p className="text-center text-red-500">{errorHistory}</p>
                ) : transactionHistory.length === 0 ? (
                    <p>No transaction history available.</p>
                ) : (
                    <div className="overflow-auto">
                        <table className="w-full bg-gray-100 rounded-md shadow-md">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Type</th>
                                    <th className="px-4 py-2">Currency</th>
                                    <th className="px-4 py-2">Quantity</th>
                                    <th className="px-4 py-2">Price</th>
                                    <th className="px-4 py-2">Fee</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactionHistory.map((transaction) => (
                                    <tr key={transaction.id} className="border-b hover:bg-gray-100">
                                        <td className="px-4 py-2 text-center">{new Date(transaction.timestamp).toLocaleString()}</td>
                                        <td className="px-4 py-2 text-center">{transaction.transaction_type}</td>
                                        <td className="px-4 py-2 text-center">{transaction.currency}</td>
                                        <td className="px-4 py-2 text-center">{transaction.quantity}</td>
                                        <td className="px-4 py-2 text-center">{transaction.price}</td>
                                        <td className="px-4 py-2 text-center">{transaction.fee}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
