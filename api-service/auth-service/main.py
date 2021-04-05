from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
import os 
from internal import db_service

class Login(BaseModel):
    userName: str
    password: str

if os.getenv("ENVIRONMENT")=='Production':

    app = FastAPI(docs_url=None, redoc_url=None)
else:
    app = FastAPI()
  

@app.post("/api/login")
def read_root(login_model: Login):
    if login_model.userName=='fuck': 
        db_service.user_create({"userName":login_model.userName,"displayName":'wtf'})     
        return {"userName":login_model.userName,"displayName":'wtf'}
    else:
        raise HTTPException(status_code=404, detail="不存在此使用者")  

