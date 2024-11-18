import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Deposit = () => {
    const [currency, setCurrency] = useState('ETH');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { authToken, logout } = useContext(AuthContext);

    const supportedCurrencies = ['USDT', 'ETH', 'BTC', 'TRX', 'TON'];

    const handleDeposit = async () => {
        setLoading(true);
        setMessage('');

        if (!authToken) {
            logout();
            setMessage('You need to be logged in to perform this action.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/wallet/deposit',
                {
                    currency: currency,
                    amount: parseFloat(amount),
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Transaction failed. Please try again.');
        } finally {
            setLoading(false);
            window.location.reload();
        }
    };

    return (
        <div className="flex justify-center items-center">
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
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                >
                    {supportedCurrencies.map((cur) => (
                        <option key={cur} value={cur}>
                            {cur}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <button
                    onClick={handleDeposit}
                    disabled={loading}
                    className={`w-full ${loading ? 'bg-blue-300' : 'bg-blue-500'} text-white p-2 rounded hover:bg-blue-600`}
                >
                    {loading ? 'Depositing...' : 'Deposit'}
                </button>
            </div>
        </div>
    );
};

export default Deposit;
