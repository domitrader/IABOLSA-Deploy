import requests
import json

symbols = ["AAPL", "MSFT", "SAN.MC", "ITX.MC"]
url = "https://iabolsa-deploy.onrender.com/api/quotes"

try:
    print(f"Testing {url} with symbols: {symbols}")
    response = requests.post(url, json={"symbols": symbols}, timeout=15)
    print(f"Status: {response.status_code}")
    print("Response Data:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
