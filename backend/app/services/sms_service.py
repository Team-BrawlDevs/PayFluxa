import requests
from dotenv import load_dotenv
import os
FAST2SMS_API_KEY = os.getenv("FAST2SMS_API_KEY")



def send_sms(phone_number: str, message: str):

    url = "https://www.fast2sms.com/dev/bulkV2"

    payload = {
        "sender_id": "FSTSMS",
        "message": message,
        "language": "english",
        "route": "q",
        "numbers": phone_number
    }

    headers = {
        "authorization": FAST2SMS_API_KEY,
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=payload, headers=headers)
    print("SMS RESPONSE:", response.json())
    return response.json()