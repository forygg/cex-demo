import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const NavBar = () => {
    const { authToken } = useContext(AuthContext);
    const [selectedTab, setSelectedTab] = useState(null); // Default selected tab

    return (
        <nav className="bg-gray-800 px-10 py-5 shadow-md relative">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-2xl font-bold">
                    <Link to="/" className="hover:text-blue-400" onClick={() => setSelectedTab(null)}>
                        CEX Platform
                    </Link>
                </div>
                {authToken && (
                    <div className="flex-1 flex justify-center items-center">
                        {/* Action Switcher */}
                        <div className="flex bg-gray-200 rounded-full p-1 w-80 shadow-md">
                                <Link to="/wallets"
                                    onClick={() => setSelectedTab('Wallets')}
                                    className={`flex-1 py-2 text-center rounded-full transition-colors ${
                                        selectedTab === 'Wallets' ? 'bg-blue-500 text-white' : 'text-gray-600'
                                    }`}
                                >
                                    Wallets
                                </Link>
                                <Link to="/orders"
                                    onClick={() => setSelectedTab('Trade')}
                                    className={`flex-1 py-2 text-center rounded-full transition-colors ${
                                        selectedTab === 'Trade' ? 'bg-green-500 text-white' : 'text-gray-600'
                                    }`}
                                >
                                    Trade
                                </Link>
                        </div>
                    </div>
                )}
                <div className="space-x-6">
                    {authToken ? (
                        <Link
                            to="/profile"
                            className="text-white text-2xl font-bold hover:text-blue-400"
                            onClick={() => setSelectedTab(null)}
                        >
                            My profile
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Signup
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
