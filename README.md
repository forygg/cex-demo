# 🌐 CEX Platform: Cryptocurrency Exchange System

Welcome to the **CEX Platform**, a cryptocurrency exchange platform designed for users to study trading concepts, place orders, and experience a simulated trading environment.

[Visit the Live Platform](http://85.208.87.192:3001/) 🚀

---

## 📋 Table of Contents
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Installation and Setup](#-installation-and-setup)
- [Screenshots](#-screenshots)
- [API Endpoints](#-api-endpoints)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- 🛒 **Order Matching**: A FIFO-based trading engine with support for partial order matching.
- 💰 **Wallet Management**: Deposit, withdraw, and manage cryptocurrency balances.
- 🎯 **Lottery Incentive**: Users win bonuses every 10 transactions.
- 💸 **Fee-Based Revenue**: Transaction fees implemented for every sell order.
- 🔒 **Authentication**: JWT-based login system.
- 📈 **Market Prices**: Integration with Binance API for real-time price updates.

---

## 🏗 System Architecture

![Architecture Diagram](https://link-to-architecture-diagram-image)

**Key Components**:
1. **Frontend**: React.js for dynamic user interface.
2. **Backend**: Flask API to handle business logic and database operations.
3. **Database**: PostgreSQL with TimescaleDB for order matching and history.
4. **Deployment**: Cloud-hosted for high availability.
5. **Integrations**: Binance API for real-time market data.

---

## 🛠 Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Flask, Flask-JWT-Extended, Flask-CORS
- **Database**: PostgreSQL + TimescaleDB
- **Deployment**: Cloud
- **External APIs**: Binance API

---

## 🚀 Installation and Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/forygg/cex-demo.git
   cd cex-platform
   ```

2. **Backend Setup**:
   - Install dependencies:
     ```bash
     python -m venv venv
     source venv/bin/activate # For Linux/Mac
     venv\Scripts\activate    # For Windows
     pip install -r requirements.txt
     ```
   - Set up the PostgreSQL database with TimescaleDB extension.
        ```bash
        psql -U postgres
        CREATE DATABASE cex;
        \c cex;
        CREATE EXTENSION timescaledb;
        ```
   - Run the backend:
     ```bash
     python app.py
     ```

3. **Frontend Setup**:
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm start
     ```

4. **Access the Platform**:
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

---

# 📸 Screenshots

## Home Page
[![Home](https://s.iimg.su/s/18/kAyFl8VL3KyO9nwEoUgznmSrqcvvHQ9JSLSVD0uC.png)](https://iimg.su/i/5AMit)

## Wallets
[![Wallets](https://s.iimg.su/s/18/GlhiZF3qJIyHMIwkipcf5BQ6h0XdtJUXoV9m6hwm.png)](https://iimg.su/i/iLQMo)

## Orders
[![Orders](https://s.iimg.su/s/18/9fo999yaXIzROsw2zYR9fjcPbf1XFXirYr0TYi1r.png)](https://iimg.su/i/UnR0U)

---

## 📡 API Endpoints

### Authentication
- **POST** `/register`: Register a new user.
- **POST** `/login`: Authenticate a user.

### Wallet Management
- **GET** `/wallets`: Fetch all wallets.
- **POST** `/wallet/deposit`: Deposit funds.
- **POST** `/wallet/withdraw`: Withdraw funds.

### Trading
- **POST** `/order`: Place an order.
- **GET** `/orders`: Fetch user orders.
- **DELETE** `/order/<id>`: Cancel an order.

### Market Data
- **GET** `/orderbook`: Fetch the latest order book.

---

## 🔮 Future Enhancements

- **KYC/AML Compliance**: Verify user identities securely.
- **2FA Security**: Add two-factor authentication.
- **Advanced Trading Features**: Add stop-loss and margin trading.
- **Scalable Deployment**: Support horizontal scaling for high traffic.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for review.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/yourusername/cex-platform/blob/main/LICENSE) file for details.

---

## 🌐 Links

- [Live Platform](http://85.208.87.192:3001/)
- [Google Presentation](https://docs.google.com/presentation/d/1xyMJPS2sinNf4aAjXuwl4vK9YB2I-PByUjFtxzJOr7Y/edit?usp=sharing)
