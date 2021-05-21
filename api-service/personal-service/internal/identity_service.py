# import requests
import os 
from  internal import secret_service
import jwt

async def user_endpoint(bearer_access_token):
    secret_string=await secret_service.get_jwt_secret()
    payload=jwt.decode(bearer_access_token.split(' ')[1], secret_string, 
    options={"verify_signature": False},
    algorithms=["RS256"])
    return payload
