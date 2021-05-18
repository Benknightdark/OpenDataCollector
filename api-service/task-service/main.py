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


@app.get("/api/schedule/{user_id}")
async def get_schedule(user_id):
    data = db_service.schedule_query_by_userid(user_id)
    return data


@app.post("/api/schedule/{user_id}")
async def post_schedule(user_id, data: ScheduleModel):
    data_dict = data.dict()
    res = db_service.add_schedule(user_id, data_dict)
    return res


@app.delete("/api/schedule/{data_id}")
async def delete_schedule(data_id):
    res = db_service.delete_schedule(id, data_id)
    return res


@app.put("/api/schedule/{data_id}")
async def post_schedule(data_id, data: ScheduleModel):
    data_dict = data.dict()
    res = db_service.update_schedule(data_id, data_dict)
    print(res)
    return res
