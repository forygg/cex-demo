import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Withdraw = () => {
    const [currency, setCurrency] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [userWallets, setUserWallets] = useState([]);
    const { authToken, logout } = useContext(AuthContext);

    useEffect(() => {
        const fetchWallets = async () => {
            if (!authToken) {
                logout();
                setMessage('You need to be logged in to perform this action.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/wallets', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setUserWallets(response.data);
                if (response.data.length > 0) {
                    setCurrency(response.data[0].currency);
                }
            } catch (error) {
                setMessage('Failed to load wallets. Please try again later.');
            }
        };

        fetchWallets();
    }, [authToken, logout]);

    const handleWithdraw = async () => {
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
                'http://localhost:5000/wallet/withdraw',
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
                    {userWallets.map((wallet) => (
                        <option key={wallet.id} value={wallet.currency}>
                            {wallet.currency}
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
                    onClick={handleWithdraw}
                    disabled={loading}
                    className={`w-full ${loading ? 'bg-blue-300' : 'bg-blue-500'} text-white p-2 rounded hover:bg-blue-600`}
                >
                    {loading ? 'Withdrawing...' : 'Withdraw'}
                </button>
            </div>
        </div>
    );
};

export default Withdraw;
