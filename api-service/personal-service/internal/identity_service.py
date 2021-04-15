import requests
import os 
from  internal import secret_service
import jwt

def user_endpoint(bearer_access_token):
    print(secret_service.get_jwt_secret())
    print(bearer_access_token.split(' ')[1])
    payload=jwt.decode(bearer_access_token.split(' ')[1], secret_service.get_jwt_secret(), 
    options={"verify_signature": False},
    algorithms=["RS256"])
    return payload
