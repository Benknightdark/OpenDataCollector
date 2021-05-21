from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
import os
from internal import db_service,identity_service
# import python_jwt as jwt
# import jwcrypto.jwk as jwk
# import datetime


class Login(BaseModel):
    userName: str
    password: str


class Register(Login):
    displayName: str
    email: EmailStr


if os.getenv("ENVIRONMENT") == 'Production':

    app = FastAPI(docs_url=None, redoc_url=None)
else:
    app = FastAPI()


@app.post("/api/login")
async def read_root(data: Login):
    data_dict=data.dict()
    query_data=db_service.user_query(data_dict)

    if query_data !=None:
        user_id=str(query_data['_id']['$oid'])
        token=await identity_service.token_endpoint(query_data['userName'],user_id)  
        return {"displayName": query_data['displayName'], "token": token['access_token'],"userId":user_id}
    else:
        raise HTTPException(status_code=404, detail="不存在此使用者")

@app.post("/api/register")
async def register(data:Register,summary="註冊"):
    data_dict=data.dict()
    create_data=db_service.user_create(data_dict)
    token=await identity_service.token_endpoint(data_dict['userName'],str(create_data.inserted_id))      
    return {"displayName": data_dict['displayName'], "token": token['access_token']}