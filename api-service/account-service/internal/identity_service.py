import requests
import os 
from internal import secret_service
def token_endpoint(user_name,user_id):
    secret_data=(secret_service.get_jwt_config())
    if os.getenv('ENVIRONMENT') == 'production':
        url =('http://localhost:3500/v1.0/invoke/identity-service/method')
    else:
        url ='htt://localhost:9414'    
    url = f"{url}/connect/token"

    payload = f'client_id={secret_data["client"]}&client_secret={secret_data["secret"]}&scope={secret_data["scope"]}&grant_type=client_credentials&user_name={user_name}&user_id={user_id}'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    return response.json()
