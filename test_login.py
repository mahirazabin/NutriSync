import requests

url = 'http://localhost:5000/login'
data = {
    "email": "mahira@email.com",
    "password": "pass123"
}

response = requests.post(url, json=data)
print(response.status_code)
print(response.json())
