from typing import List, Optional
from fastapi import FastAPI, Header,HTTPException
import requests
import re
from pydantic import BaseModel
from internal import db_service
import os 

if os.getenv("ENVIRONMENT")=='Production':

    app = FastAPI(docs_url=None, redoc_url=None)
else:
    app = FastAPI()
  


@app.get("/")
def read_root():
    return {"Hello": "Task Service"}

@app.get("/api/schedule")
async def get_schedule():
    data=db_service.schedule_query()
    return data
    
@app.get("/api/schedule/{id}")
async def get_schedule(id):
    data=db_service.schedule_query_by_userid(id)
    return data 

# post
# put 


