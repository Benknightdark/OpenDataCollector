import os
import requests
import httpx
async def get_jwt_secret():
    if os.getenv('ENVIRONMENT') == 'production':
        new_key = f'jwtConfig:secret'
        url = (
            f'http://localhost:3500/v1.0/secrets/my-secret-store/{new_key}')
        client = httpx.AsyncClient(http2=True)

        res = (await client.get(url))
        res_data=res.json()[new_key]
        await res.aclose()
        return res_data
    else:
        return "9e564bd21af4a8ba8fd0cde4c38cec3de51ae169b13339777f5fdbd4a044f22c"
