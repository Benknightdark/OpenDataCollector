import os
import httpx
async def get_jwt_config():
    if os.getenv('ENVIRONMENT') == 'production':
        if os.getenv("CLIENT") !=None:
            return {
                "client": os.getenv("CLIENT"),
                "scope": os.getenv("SCOPE"),
                "secret":os.getenv("SECRET")
            }            
        else:
            url = f'http://localhost:3500/v1.0/secrets/kubernetes/opendatasecrets'
            client = httpx.AsyncClient(http2=True)    
            res = await client.get(url)
            res_data=res.json()
            await client.aclose()   
            return res_data
    else:
        return {
            "client": "client",
            "scope": "api1",
            "secret": "9e564bd21af4a8ba8fd0cde4c38cec3de51ae169b13339777f5fdbd4a044f22c"
        }