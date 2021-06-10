# import requests
import os 
from  . import secret_service
import jwt
async def user_endpoint(bearer_access_token):
    secret_string=await secret_service.get_jwt_config()
    payload=jwt.decode(bearer_access_token.split(' ')[1], secret_string['secret'], 
    options={"verify_signature": False},
    algorithms=["RS256"])
    print(payload)
    return payload
