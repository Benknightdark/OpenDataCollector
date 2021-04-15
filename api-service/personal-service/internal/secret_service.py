import os
import requests
def get_jwt_secret():
    if os.getenv('ENVIRONMENT') == 'production':
        new_key = f'jwtConfig:secret'
        url = (
            f'http://localhost:3500/v1.0/secrets/my-secret-store/{new_key}')
        res = requests.get(url).json()[new_key]
        return res
    else:
        return "9e564bd21af4a8ba8fd0cde4c38cec3de51ae169b13339777f5fdbd4a044f22c"
