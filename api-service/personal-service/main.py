from typing import List, Optional
from fastapi import FastAPI
import requests
from bs4 import BeautifulSoup
import re
from pydantic import BaseModel
import os 

if os.getenv("ENVIRONMENT")=='Production':

    app = FastAPI(docs_url=None, redoc_url=None)
else:
    app = FastAPI()
  


@app.get("/")
def read_root():
    return {"Hello": "Personal Service"}


