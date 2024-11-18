from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import secrets
from datetime import datetime
from decimal import Decimal
from flask_cors import CORS
from sqlalchemy.sql import text
from sqlalchemy import PrimaryKeyConstraint
from sqlalchemy import Sequence

app = Flask(__name__)
CORS(app, origins=['http://85.208.87.192:3001'])
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:innokek@localhost/cex'
app.config['JWT_SECRET_KEY'] = secrets.token_hex(32)
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False

db = SQLAlchemy(app)
jwt = JWTManager(app)




class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(256), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    email = db.Column(db.String(256), unique=True, nullable=False)
    is_verified = db.Column(db.Boolean, default=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Wallet(db.Model):
    __tablename__ = 'wallet'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    currency = db.Column(db.String(10), nullable=False)
    balance = db.Column(db.Numeric(precision=18, scale=8), default=Decimal('0.0'))
    is_hot = db.Column(db.Boolean, default=True)

    user = db.relationship('User', backref=db.backref('wallets', lazy=True))

class Order(db.Model):
    __tablename__ = 'order'
    id = db.Column(db.Integer, Sequence('order_id_seq'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    order_type = db.Column(db.String(10), nullable=False)
    currency = db.Column(db.String(10), nullable=False)
    base_currency = db.Column(db.String(10), nullable=False)
    quantity = db.Column(db.Numeric(precision=18, scale=8), nullable=False)
    price = db.Column(db.Numeric(precision=18, scale=8), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    status = db.Column(db.String(20), default='active', nullable=False)


    user = db.relationship('User', backref=db.backref('orders', lazy=True))

    __table_args__ = (
        PrimaryKeyConstraint('id', 'timestamp'),
    )

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    buy_order_id = db.Column(db.Integer, nullable=False)
    buy_order_timestamp = db.Column(db.DateTime, nullable=False)
    sell_order_id = db.Column(db.Integer, nullable=False)
    sell_order_timestamp = db.Column(db.DateTime, nullable=False)
    currency = db.Column(db.String(10), nullable=False)
    base_currency = db.Column(db.String(10), nullable=False)
    quantity = db.Column(db.Numeric(precision=18, scale=8), nullable=False)
    price = db.Column(db.Numeric(precision=18, scale=8), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    transaction_type = db.Column(db.String(10), nullable=False)
    fee = db.Column(db.Numeric(precision=18, scale=8), nullable=False, default=Decimal('0.0'))

    __table_args__ = (
        db.ForeignKeyConstraint(
            ['buy_order_id', 'buy_order_timestamp'], ['order.id', 'order.timestamp']
        ),
        db.ForeignKeyConstraint(
            ['sell_order_id', 'sell_order_timestamp'], ['order.id', 'order.timestamp']
        ),
    )

with app.app_context():
    db.create_all()
    try:
        db.session.execute(text("SELECT create_hypertable('order', 'timestamp', if_not_exists => TRUE);"))
        db.session.commit()
    except Exception as e:
        print(f"Hypertable creation error: {e}")


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not username or not password or not email:
        return jsonify({"message": "All fields are required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 400

    new_user = User(username=username, email=email)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200

    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/wallet/deposit', methods=['POST'])
@jwt_required()
def deposit():
    current_user = get_jwt_identity()
    data = request.get_json()
    currency = data.get('currency')
    amount = data.get('amount')

    try:
        amount = Decimal(amount)
    except ValueError:
        return jsonify({"message": "Invalid amount format"}), 400

    wallet = Wallet.query.filter_by(user_id=current_user, currency=currency).first()

    if not wallet:
        wallet = Wallet(user_id=current_user, currency=currency, balance=Decimal(0.0))
        db.session.add(wallet)

    if wallet.balance is None:
        wallet.balance = Decimal(0.0)

    wallet.balance += amount

    db.session.commit()

    return jsonify({"message": "Deposit successful", "balance": str(wallet.balance)}), 200

@app.route('/wallet/withdraw', methods=['POST'])
@jwt_required()
def withdraw():
    current_user = get_jwt_identity()
    data = request.get_json()
    currency = data.get('currency')
    amount = data.get('amount')

    if not currency or amount is None:
        return jsonify({"message": "Currency and amount are required"}), 400

    try:
        amount = Decimal(amount)
    except ValueError:
        return jsonify({"message": "Invalid amount format"}), 400

    wallet = Wallet.query.filter_by(user_id=current_user, currency=currency).first()
    if not wallet or wallet.balance < amount:
        return jsonify({"message": "Insufficient balance"}), 400

    wallet.balance -= amount
    db.session.commit()

    return jsonify({"message": "Withdrawal successful", "balance": str(wallet.balance)}), 200

def match_orders_from_db(currency, base_currency):
    matched_orders = []
    try:
        buy_orders = Order.query.filter_by(order_type='buy', currency=currency, base_currency=base_currency, status='active').order_by(Order.price.desc(), Order.timestamp).all()
        sell_orders = Order.query.filter_by(order_type='sell', currency=currency, base_currency=base_currency, status='active').order_by(Order.price, Order.timestamp).all()

        fee_percentage = Decimal('0.001')

        while buy_orders and sell_orders:
            buy_order = buy_orders[0]
            sell_order = sell_orders[0]

            if buy_order.price >= sell_order.price:
                matched_quantity = min(buy_order.quantity, sell_order.quantity)
                print(buy_order.quantity, sell_order.quantity)
                trade_price = sell_order.price
                print (trade_price, matched_quantity)
                total_cost = trade_price * matched_quantity
                fee = total_cost * fee_percentage

                buyer_base_wallet = Wallet.query.filter_by(user_id=buy_order.user_id, currency=base_currency).first()
                buyer_target_wallet = Wallet.query.filter_by(user_id=buy_order.user_id, currency=currency).first()
                seller_base_wallet = Wallet.query.filter_by(user_id=sell_order.user_id, currency=base_currency).first()
                seller_target_wallet = Wallet.query.filter_by(user_id=sell_order.user_id, currency=currency).first()

                if not buyer_base_wallet or not seller_target_wallet:
                    print(1)
                    break

                if not buyer_target_wallet:
                    buyer_target_wallet = Wallet(user_id=buy_order.user_id, currency=currency, balance=Decimal('0.0'))
                    db.session.add(buyer_target_wallet)

                if not seller_base_wallet:
                    seller_base_wallet = Wallet(user_id=sell_order.user_id, currency=base_currency, balance=Decimal('0.0'))
                    db.session.add(seller_base_wallet)

                if buyer_base_wallet.balance < total_cost:
                    print(buyer_base_wallet.balance, total_cost)

                buyer_base_wallet.balance -= total_cost
                buyer_target_wallet.balance += matched_quantity
                seller_target_wallet.balance -= matched_quantity
                seller_base_wallet.balance += total_cost - fee

                buy_order.quantity -= matched_quantity
                sell_order.quantity -= matched_quantity

                buyer_transaction = Transaction(
                    user_id=buy_order.user_id,
                    buy_order_id=buy_order.id,
                    buy_order_timestamp=buy_order.timestamp,
                    sell_order_id=sell_order.id,
                    sell_order_timestamp=sell_order.timestamp,
                    currency=currency,
                    base_currency=base_currency,
                    quantity=matched_quantity,
                    price=trade_price,
                    transaction_type='buy',
                    fee=fee
                )
                db.session.add(buyer_transaction)

                seller_transaction = Transaction(
                    user_id=sell_order.user_id,
                    buy_order_id=buy_order.id,
                    buy_order_timestamp=buy_order.timestamp,
                    sell_order_id=sell_order.id,
                    sell_order_timestamp=sell_order.timestamp,
                    currency=currency,
                    base_currency=base_currency,
                    quantity=matched_quantity,
                    price=trade_price,
                    transaction_type='sell',
                    fee=fee
                )
                db.session.add(seller_transaction)

                matched_orders.append({
                    'currency_pair': f"{currency}/{base_currency}",
                    'buy_order_id': buy_order.id,
                    'sell_order_id': sell_order.id,
                    'price': float(trade_price),
                    'quantity': float(matched_quantity),
                    'fee': float(fee)
                })

                if buy_order.quantity == 0:
                    buy_order.status = 'completed'
                    buy_orders.pop(0)
                if sell_order.quantity == 0:
                    sell_order.status = 'completed'
                    sell_orders.pop(0)
                break
            else:
                break

        db.session.commit()
    except Exception as e:
        print(f"Error matching orders: {e}")
        db.session.rollback()

    return matched_orders




@app.route('/order', methods=['POST'])
@jwt_required()
def place_order():
    current_user = get_jwt_identity()
    data = request.get_json()
    order_type = data.get('order_type')
    currency = data.get('currency')
    base_currency = data.get('base_currency')
    price = data.get('price')
    quantity = data.get('quantity')

    if not order_type or not currency or not base_currency or price is None or quantity is None:
        return jsonify({"message": "Order type, currency, base currency, price, and quantity are required"}), 400

    try:
        price = Decimal(price)
        quantity = Decimal(quantity)
    except ValueError:
        return jsonify({"message": "Invalid price or quantity format"}), 400

    if quantity <= 0 or price <= 0:
        return jsonify({"message": "Price and quantity must be greater than zero"}), 400

    new_order = Order(
        user_id=current_user,
        order_type=order_type,
        currency=currency.upper(),
        base_currency=base_currency.upper(),
        price=price,
        quantity=quantity
    )
    db.session.add(new_order)
    db.session.commit()

    matched_orders = match_orders_from_db(currency, base_currency)

    return jsonify({"message": "Order placed successfully", "matched_orders": matched_orders}), 200

# Profile endpoint
@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    if not user:
        return jsonify({"message": "User not found"}), 404

    profile_data = {
        "username": user.username,
        "email": user.email,
        "is_verified": user.is_verified
    }

    return jsonify(profile_data), 200

# Wallets endpoint
@app.route('/wallets', methods=['GET'])
@jwt_required()
def get_wallets():
    current_user = get_jwt_identity()
    wallets = Wallet.query.filter_by(user_id=current_user).all()

    wallet_data = [
        {
            "id": wallet.id,
            "currency": wallet.currency,
            "balance": str(wallet.balance)
        } for wallet in wallets
    ]

    return jsonify(wallet_data), 200

# Orders endpoint
@app.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    current_user = get_jwt_identity()
    orders = Order.query.filter_by(user_id=current_user, status='active').all()

    order_data = [
        {
            "id": order.id,
            "order_type": order.order_type,
            "currency": order.currency,
            "base_currency": order.base_currency,
            "quantity": str(order.quantity),
            "price": str(order.price),
            "timestamp": order.timestamp.isoformat()
        } for order in orders
    ]

    return jsonify(order_data), 200

@app.route('/orderbook', methods=['GET'])
def get_orderbook():
    try:
        buy_orders = Order.query.filter_by(order_type='buy', status='active').order_by(Order.price.desc(), Order.timestamp).all()
        sell_orders = Order.query.filter_by(order_type='sell', status='active').order_by(Order.price, Order.timestamp).all()

        buy_orders_data = [
            {
                "id": order.id,
                "user_id": order.user_id,
                "currency": order.currency,
                "base_currency": order.base_currency,
                "quantity": str(order.quantity),
                "price": str(order.price),
                "timestamp": order.timestamp.isoformat()
            } for order in buy_orders
        ]

        sell_orders_data = [
            {
                "id": order.id,
                "user_id": order.user_id,
                "currency": order.currency,
                "base_currency": order.base_currency,
                "quantity": str(order.quantity),
                "price": str(order.price),
                "timestamp": order.timestamp.isoformat()
            } for order in sell_orders
        ]

        return jsonify({
            "buy_orders": buy_orders_data,
            "sell_orders": sell_orders_data
        }), 200
    except Exception as e:
        print(f"Error fetching order book: {e}")
        return jsonify({"message": "Failed to fetch order book"}), 500

@app.route('/order/<int:order_id>', methods=['DELETE'])
@jwt_required()
def delete_order(order_id):
    current_user = get_jwt_identity()
    try:
        order = Order.query.filter_by(id=order_id, user_id=current_user).first()

        if not order:
            return jsonify({"message": "Order not found or not authorized"}), 404

        db.session.delete(order)
        db.session.commit()

        return jsonify({"message": "Order deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting order: {e}")
        db.session.rollback()
        return jsonify({"message": "Failed to delete order"}), 500

@app.route('/transactions', methods=['GET'])
@jwt_required()
def transactions():
    current_user = get_jwt_identity()
    try:
        transactions = db.session.execute(text("""
            SELECT
                t.user_id,
                t.id,
                t.transaction_type,
                t.buy_order_id,
                t.sell_order_id,
                t.currency,
                t.base_currency,
                t.quantity,
                t.price,
                t.timestamp,
                t.fee
            FROM transactions t
            WHERE t.user_id = :user_id
            ORDER BY t.timestamp DESC
        """), {'user_id': current_user}).fetchall()
        transaction_data = [
            {
                'id': t.id,
                'buy_order_id': t.buy_order_id,
                'sell_order_id': t.sell_order_id,
                'currency': t.currency,
                'base_currency': t.base_currency,
                'quantity': float(t.quantity),
                'price': float(t.price),
                'timestamp': t.timestamp.isoformat(),
                'transaction_type': t.transaction_type,
                'fee': t.fee
            }
            for t in transactions
        ]
        return jsonify(transaction_data), 200
    except Exception as e:
        print(f"Error fetching transactions: {e}")
        return jsonify({"message": "Failed to fetch transaction history."}), 500



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)