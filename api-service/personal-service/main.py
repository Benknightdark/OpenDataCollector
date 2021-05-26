from typing import List, Optional
from fastapi import FastAPI, Header,HTTPException
# import requests
import re
from pydantic import BaseModel
from internal import identity_service,db_service
import os 

if os.getenv("ENVIRONMENT")=='Production':

    app = FastAPI(docs_url=None, redoc_url=None)
else:
    app = FastAPI()
  


@app.get("/")
def read_root():
    return {"Hello": "Personal Service"}

@app.get("/api/user-info")
async def user_info(Authorization: Optional[str] = Header(None)):
    res=await identity_service.user_endpoint(Authorization)
    user=db_service.user_query(res["client_user_id"])
    return user
    
 


