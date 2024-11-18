import requests
import random
from decimal import Decimal
import time
from concurrent.futures import ThreadPoolExecutor

API_BASE = "http://localhost:5000"
TOKENS = ["BTC", "ETH", "TON", "TRX"]
BASE_CURRENCY = "USDT"
ORDERS_PER_TOKEN = 10
INITIAL_BALANCE = Decimal("100000000.0")
SPREAD = Decimal("0.001")
UPDATE_INTERVAL = 3

def login_market_maker(username, password):
    response = requests.post(f"{API_BASE}/login", json={"username": username, "password": password})
    if response.status_code == 200:
        return response.json().get("access_token")
    return None

def register_market_maker(username, password, email):
    response = requests.post(
        f"{API_BASE}/register",
        json={"username": username, "password": password, "email": email},
    )
    if response.status_code == 201:
        print(f"Market maker {username} registered successfully.")
    elif response.status_code == 400 and "already exists" in response.json().get("message", ""):
        print(f"Market maker {username} already exists.")
    else:
        print(f"Failed to register {username}: {response.json()}")

def deposit_to_wallet(auth_token, currency, amount):
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.post(
        f"{API_BASE}/wallet/deposit",
        json={"currency": currency, "amount": str(amount)},
        headers=headers,
    )
    if response.status_code == 200:
        print(f"Deposited {amount} {currency} to market maker wallet.")
    else:
        print(f"Failed to deposit {currency}: {response.json()}")

def ensure_wallet_balances(auth_token, token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.get(f"{API_BASE}/wallets", headers=headers)

    if response.status_code == 200:
        existing_wallets = {wallet["currency"]: Decimal(wallet["balance"]) for wallet in response.json()}

        if token not in existing_wallets or existing_wallets[token] < INITIAL_BALANCE:
                amount_to_deposit = INITIAL_BALANCE - existing_wallets.get(token, Decimal("0.0"))
                deposit_to_wallet(auth_token, token, amount_to_deposit)
    else:
        print(f"Failed to fetch wallets: {response.json()}")

def get_market_price(token):
    symbol = f"{token}{BASE_CURRENCY}"
    response = requests.get(f"https://api.binance.com/api/v3/ticker/price?symbol={symbol}")
    if response.status_code == 200:
        return Decimal(response.json()["price"])
    else:
        print(f"Failed to fetch price for {token}: {response.json()}")
        return None

def get_active_orders(auth_token, currency):
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.get(f"{API_BASE}/orders", headers=headers)
    if response.status_code == 200:
        return [order for order in response.json() if order["currency"] == currency]
    else:
        print(f"Failed to fetch active orders: {response.json()}")
        return []

def delete_order(auth_token, order_id):
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.delete(f"{API_BASE}/order/{order_id}", headers=headers)
    if response.status_code == 200:
        print(f"Deleted order {order_id}.")
    else:
        print(f"Failed to delete order {order_id}: {response.json()}")

def place_order(auth_token, order_type, price, quantity, currency):
    headers = {"Authorization": f"Bearer {auth_token}"}
    order_data = {
        "order_type": order_type,
        "price": str(price),
        "quantity": str(quantity),
        "currency": currency,
        "base_currency": BASE_CURRENCY,
    }
    response = requests.post(f"{API_BASE}/order", json=order_data, headers=headers)
    if response.status_code == 200:
        print(f"Order placed: {order_type} {quantity} {currency} at {price} {BASE_CURRENCY}")
    else:
        print(f"Failed to place order: {response.json()}")

def market_maker(auth_token, token):
    while True:
        try:
            current_price = get_market_price(token)
            if current_price:
                active_orders = get_active_orders(auth_token, token)

                while len(active_orders) > ORDERS_PER_TOKEN:
                    delete_order(auth_token, active_orders[0]["id"])
                    active_orders.pop(0)

                while len(active_orders) <= ORDERS_PER_TOKEN:
                    bid_price = current_price * (1 - SPREAD + Decimal(random.uniform(-0.0005, 0.0005)))
                    ask_price = current_price * (1 + SPREAD + Decimal(random.uniform(-0.0005, 0.0005)))
                    quantity = Decimal(random.uniform(0.1, 3))

                    place_order(auth_token, "buy", bid_price, quantity, token)
                    place_order(auth_token, "sell", ask_price, quantity, token)
                    active_orders.append({})

            time.sleep(UPDATE_INTERVAL)
        except Exception as e:
            print(f"Error in market maker for {token}: {e}")

def setup_market_makers():
    def create_market_maker(token):
        username = f"MarketMaker_{token}"
        password = "securepassword123"
        email = f"{username.lower()}@example.com"

        register_market_maker(username, password, email)
        auth_token = login_market_maker(username, password)
        if auth_token:
            print(f"Ensuring wallet balances for {username}...")
            ensure_wallet_balances(auth_token, token)
            print(f"Starting market maker for {token}...")
            market_maker(auth_token, token)
        else:
            print(f"Failed to start market maker for {token}")

    with ThreadPoolExecutor(max_workers=len(TOKENS)) as executor:
        executor.map(create_market_maker, TOKENS)

if __name__ == "__main__":
    setup_market_makers()
