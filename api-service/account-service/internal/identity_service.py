import requests
import os 

def token_endpoint(user_name,user_id):
    if os.getenv('ENVIRONMENT') == 'production':
        url =('http://localhost:3500/v1.0/invoke/identity-service/method')
    else:
        url ='htt://localhost:9414'    
    url = f"{url}/connect/token"

    payload = f'client_id=client&client_secret=secret&scope=api1&grant_type=client_credentials&user_name={user_name}&user_id={user_id}'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    return response.json()
