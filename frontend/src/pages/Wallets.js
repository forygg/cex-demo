import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Deposit from '../components/Wallet/Deposit';
import Withdraw from '../components/Wallet/Withdraw';

const Wallets = () => {
    const [wallets, setWallets] = useState([]);
    const [totalBalanceUSD, setTotalBalanceUSD] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedAction, setSelectedAction] = useState('Deposit');

    const { authToken, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchWallets = async () => {
        try {
            if (!authToken) {
                navigate("/login");
            }
            const response = await axios.get('http://85.208.87.192:5001/wallets', {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            const walletsData = response.data;

            setWallets(walletsData);

            // Calculate total balance in USD
            let total = 0;
            for (const wallet of walletsData) {
                if (wallet.currency === 'USDT') {
                    total += parseFloat(wallet.balance); // Already in USD
                } else {
                    const marketPrice = await fetchMarketPrice(wallet.currency);
                    if (marketPrice) {
                        total += parseFloat(wallet.balance) * marketPrice;
                    }
                }
            }
            setTotalBalanceUSD(total.toFixed(2));
        } catch (err) {
            setError('Failed to load wallets.');
            logout();
        } finally {
            setLoading(false);
        }
    };

    const fetchMarketPrice = async (token) => {
        const symbol = `${token}USDT`; // Assuming base currency is USDT
        try {
            const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
            return parseFloat(response.data.price);
        } catch (err) {
            console.error(`Failed to fetch price for ${token}:`, err);
            return null;
        }
    };

    useEffect(() => {
        fetchWallets();
    }, [authToken, navigate]);

    const handleTransactionSuccess = () => {
        setLoading(true);
        setTimeout(() => {
            window.location.reload(); // Reload the page to fetch updated wallets
        }, 500);
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">Wallets</h1>
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <div className="text-gray-500">Loading...</div>
                </div>
            ) : error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : (
                <div className="flex flex-col gap-6 md:flex-row md:gap-8">
                    <div className="flex-1 bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-medium text-gray-800">Your Wallets</h2>
                        <p className="text-sm text-gray-500 mb-4">Total Balance: <strong>${totalBalanceUSD}</strong></p>
                        {wallets.length === 0 ? (
                            <div className="text-gray-500">No wallets available.</div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {wallets.map((wallet) => (
                                    <li key={wallet.id} className="py-3 flex justify-between">
                                        <span className="font-medium text-gray-800">{wallet.currency}</span>
                                        <span className="text-gray-600">{wallet.balance}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="flex-1 bg-white rounded-lg shadow p-6">
                        {/* Action Switcher */}
                        <div className="flex justify-center items-center bg-gray-100 rounded-lg p-1 mb-6">
                            <button
                                onClick={() => setSelectedAction('Deposit')}
                                className={`flex-1 py-2 rounded-md ${
                                    selectedAction === 'Deposit'
                                        ? 'bg-green-500 text-white shadow'
                                        : 'text-gray-500 hover:bg-gray-200'
                                }`}
                            >
                                Deposit
                            </button>
                            <button
                                onClick={() => setSelectedAction('Withdraw')}
                                className={`flex-1 py-2 rounded-md ${
                                    selectedAction === 'Withdraw'
                                        ? 'bg-yellow-500 text-white shadow'
                                        : 'text-gray-500 hover:bg-gray-200'
                                }`}
                            >
                                Withdraw
                            </button>
                        </div>
                        <div>
                            {selectedAction === 'Deposit' ? (
                                <Deposit onSuccess={handleTransactionSuccess} />
                            ) : (
                                <Withdraw onSuccess={handleTransactionSuccess} />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wallets;
