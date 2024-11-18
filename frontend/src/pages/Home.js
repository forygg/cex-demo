import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="homepage bg-gray-100 min-h-screen flex flex-col items-center justify-center p-10">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to CEX Platform</h1>
        <p className="text-lg text-gray-700">The ultimate platform for secure cryptocurrency trading</p>
      </header>
      
      <div className="action-buttons flex space-x-6">
        <Link to="/wallets" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
          Explore
        </Link>
      </div>

      <section className="features mt-20 max-w-4xl">
        <h2 className="text-2xl font-semibold mb-6">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="feature bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-purple-500 mb-4">Secure Wallet Management</h3>
            <p className="text-gray-600">Manage your cryptocurrency securely with our hot and cold wallet system to ensure maximum safety of your assets.</p>
          </div>
          <div className="feature bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-indigo-500 mb-4">Order Placement and Matching</h3>
            <p className="text-gray-600">Place buy and sell orders and benefit from our fast and reliable matching engine, designed to maximize your trading efficiency.</p>
          </div>
          <div className="feature bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-red-500 mb-4">Real-Time Order Book</h3>
            <p className="text-gray-600">Keep track of market movements with our real-time order book and make informed trading decisions.</p>
          </div>
          <div className="feature bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-yellow-500 mb-4">User-Friendly Interface</h3>
            <p className="text-gray-600">Enjoy a streamlined and intuitive user interface designed to provide a seamless trading experience for all levels of users.</p>
          </div>
        </div>
      </section>

      <footer className="mt-20 text-center">
        <p className="text-gray-500">&copy; 2024 CEX Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;