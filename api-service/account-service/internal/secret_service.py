import logging
import os
import httpx
async def get_jwt_config():
    if os.getenv('ENVIRONMENT') == 'production':
        url = (
                f'http://localhost:3500/v1.0/secrets/my-secret-store/bulk')
        client = httpx.AsyncClient(http2=True)    
        res = await client.get(url)
        res_data=res.json()
        print(res_data)
        await client.aclose()   
        jwt_config_key = ["client", "scope", "secret"]
        jwt_config_data = {}
        for j in jwt_config_key:
            jwt_config_data[j] = res_data[f'jwtConfig:{j}'][f'jwtConfig:{j}']
            await client.aclose()
        return jwt_config_data
    else:
        return {
            "client": "client",
            "scope": "api1",
            "secret": "9e564bd21af4a8ba8fd0cde4c38cec3de51ae169b13339777f5fdbd4a044f22c"
        }
