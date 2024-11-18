import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Deposit from './Deposit';
import Withdraw from './Withdraw';

const Wallets = () => {
    const [wallets, setWallets] = useState([]);
    const [totalBalanceUSD, setTotalBalanceUSD] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedAction, setSelectedAction] = useState('Deposit');

    const { authToken } = useContext(AuthContext);

    useEffect(() => {
        const fetchWallets = async () => {
            try {
                const response = await axios.get('http://localhost:5000/wallets', {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setWallets(response.data);

                // Example: Calculate total balance (can be connected to live price APIs)
                setTotalBalanceUSD(response.data.reduce((total, wallet) => total + parseFloat(wallet.balance), 0).toFixed(2));
            } catch (err) {
                setError('Failed to load wallets.');
                logout();
            } finally {
                setLoading(false);
            }
        };

        fetchWallets();
    }, [authToken]);

    const handleTransactionSuccess = () => {
        setLoading(true);
        setTimeout(() => {
            window.location.reload(); // Reload the page to fetch updated wallets
        }, 500);
    };

    return (
        <div className="p-10 min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-center mb-10 text-blue-600">Wallets</h1>
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Your Wallets</h2>
                        <p className="mb-4 font-bold">Total Balance (USD): ${totalBalanceUSD}</p>
                        {wallets.length === 0 ? (
                            <p>No wallets available.</p>
                        ) : (
                            <ul>
                                {wallets.map((wallet) => (
                                    <li key={wallet.id} className="mb-4">
                                        <p className="font-bold">Currency: {wallet.currency}</p>
                                        <p>Balance: {wallet.balance}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="bg-white p-6 rounded shadow-md">
                        {/* Action Switcher */}
                        <div className="flex justify-center mb-4">
                            <div className="flex bg-gray-200 rounded-full p-1 w-60 shadow-md">
                                <button
                                    onClick={() => setSelectedAction('Deposit')}
                                    className={`flex-1 py-2 text-center rounded-full ${
                                        selectedAction === 'Deposit' ? 'bg-green-600 text-white' : 'text-gray-600'
                                    }`}
                                >
                                    Deposit
                                </button>
                                <button
                                    onClick={() => setSelectedAction('Withdraw')}
                                    className={`flex-1 py-2 text-center rounded-full ${
                                        selectedAction === 'Withdraw' ? 'bg-yellow-600 text-white' : 'text-gray-600'
                                    }`}
                                >
                                    Withdraw
                                </button>
                            </div>
                        </div>
                        {selectedAction === 'Deposit' ? (
                            <Deposit onSuccess={handleTransactionSuccess} />
                        ) : (
                            <Withdraw onSuccess={handleTransactionSuccess} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wallets;
