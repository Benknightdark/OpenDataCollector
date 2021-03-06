from typing import List, Optional
from fastapi import FastAPI, Header, HTTPException, Request
from internal import db_service
import os
from pydantic import BaseModel
import logging
logging.basicConfig(level=logging.INFO)


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


@app.get("/api/schedule", summary="取得所有使用者的排程")
async def get_schedule():
    data = await db_service.schedule_query()
    return data


@app.get("/api/schedule/{user_id}", summary="取得特定使用者的排程")
async def get_schedule_by_user_id(user_id):
    '''
    * {user_id} : 使用者id
    '''
    data = await db_service.schedule_query_by_userid(user_id)
    return data


@app.post("/api/schedule/{user_id}", summary="新增特定使用者的排程")
async def post_schedule(user_id, data: ScheduleModel):
    '''
    * {user_id} : 使用者id
    * {data} : 欲新增的排程資料
    '''
    data_dict = data.dict()
    res = await db_service.add_schedule(user_id, data_dict)
    print(res)
    return res


@app.delete("/api/schedule/{data_id}", summary="刪除使用者的排程")
async def delete_schedule(data_id):
    '''
    * {data_id} : 排程id
    '''
    res = await db_service.delete_schedule(data_id)
    return res


@app.put("/api/schedule/{data_id}", summary="修改使用者的排程")
async def put_schedule(data_id, data: ScheduleModel):
    '''
    * {data_id} : 排程id
    * {data} : 欲修改的排程資料
    '''
    data_dict = data.dict()
    res = await db_service.update_schedule(data_id, data_dict)
    return res


@app.get("/api/history/{user_id}/{schedule_id}", summary="取得使用者的排程執行歷史資料")
async def get_schedule(user_id, schedule_id):
    data = await db_service.history_query(user_id, schedule_id)
    return data


@app.get("/api/summary/history/{user_id}", summary="取得使用者的排程執行歷史總計資料")
async def get_schedule_summary(user_id):
    data = await db_service.history_summary_query(user_id)
    return data

@app.get("/api/download/history/{schedule_id}", summary="取得使用者的排程執行歷史列表")
async def get_schedule_summary(schedule_id):
    data = await db_service.history_download_query(schedule_id)
    return data


@app.get("/api/download/history/detail/{schedule_id}/{record_id}", summary="取得使用者的排程執行歷史下載資料")
async def get_schedule_summary(schedule_id,record_id):
    data = await db_service.history_download_detail(schedule_id,record_id)
    return data