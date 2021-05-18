from typing import List, Optional
from fastapi import FastAPI, Header, HTTPException, Request
from internal import db_service
import os
from pydantic import BaseModel


class ScheduleModel(BaseModel):
    url: Optional[str]
    name: Optional[str]
    type:  Optional[str]
    executeTime: Optional[str]


if os.getenv("ENVIRONMENT") == 'Production':

    app = FastAPI(docs_url=None, redoc_url=None)
else:
    app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "Task Service"}


@app.get("/api/schedule")
async def get_schedule():
    data = db_service.schedule_query()
    return data


@app.get("/api/schedule/{id}")
async def get_schedule(id):
    data = db_service.schedule_query_by_userid(id)
    return data


@app.post("/api/schedule/{id}")
async def post_schedule(id, data: ScheduleModel):
    data_dict =  data.dict()
    db_service.add_schedule(id, data_dict)
    return {}
# post
# put
# delete
