import os 
from internal import secret_service
import httpx

async def token_endpoint(user_name,user_id):
    secret_data=await secret_service.get_jwt_config()
    print(secret_data)
    if os.getenv('ENVIRONMENT') == 'production':
        url =('http://localhost:3500/v1.0/invoke/identity-service/method')
    else:
        url ='http://localhost:9414'    
    url = f"{url}/connect/token"
    print(url)

    payload = f'client_id={secret_data["client"]}&client_secret={secret_data["secret"]}&scope={secret_data["scope"]}&grant_type=client_credentials&user_name={user_name}&user_id={user_id}'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    client = httpx.AsyncClient(http2=True)    
    res = await client.post(url, headers=headers, data=payload)
    
    res_data = res.json()
    await client.aclose()
    return res_data
