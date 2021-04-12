import requests
import os


def get_jwt_config():
    if os.getenv('ENVIRONMENT') == 'production':
        jwt_config_key = ["client", "scope", "secret"]
        jwt_config_data = {}
        for j in jwt_config_key:
            new_key = f'jwtConfig:{j}'
            url = (
                f'http://localhost:3500/v1.0/secrets/my-secret-store/{new_key}')
            res = requests.get(url).json()[new_key]
            jwt_config_data[j] = res
        return jwt_config_data
    else:
        return {
            "client": "client",
            "scope": "api1",
            "secret": "9e564bd21af4a8ba8fd0cde4c38cec3de51ae169b13339777f5fdbd4a044f22c"
        }
