from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from internal import db_service
import python_jwt as jwt
import jwcrypto.jwk as jwk
import datetime
import requests

class Login(BaseModel):
    userName: str
    password: str


if os.getenv("ENVIRONMENT") == 'Production':

    app = FastAPI(docs_url=None, redoc_url=None)
else:
    app = FastAPI()
@app.get("/")
def get_token():
    url = "http://identity-service/connect/token"

    payload='client_id=client&client_secret=secret&scope=api1&grant_type=client_credentials'
    headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    return(response.json())


@app.post("/api/login")
def read_root(login_model: Login):
    
    if login_model.userName == 'fuck':
        db_service.user_create(
            {"userName": login_model.userName, "displayName": 'wtf'})
        return {"userName": login_model.userName, "displayName": 'wtf'}
    else:
        raise HTTPException(status_code=404, detail="不存在此使用者")
