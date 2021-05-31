from fastapi import FastAPI, Request
import os
import httpx
from apscheduler.schedulers.background import BackgroundScheduler
import asyncio
import os
import httpx
import logging
import datetime
import data_process 
logging.basicConfig(level="INFO")
sched = BackgroundScheduler()
async def init_scheduler():
    await asyncio.sleep(delay=10)
    async with httpx.AsyncClient() as client:
        r = await client.get('http://localhost:3500/v1.0/invoke/task-service/method/api/schedule')
        schedule_list = r.json()
        for s in schedule_list:
            logging.info(f"使用者：{s['userId']}")
            logging.info(s)
            for d in s['data']:
                logging.info(f'''
                ======================================
                ID:{d['_id']['$oid']}
                執行時間：{d['executeTime']}
                網址：{d['url']}
                檔案類型：{d['type']}
                檔名：{d['name']}
                ======================================
                ''')
                sched.add_job(
                    data_process.download,
                    id=d['_id']['$oid'],
                    hour=f"{d['executeTime'].split(':')[0]}", 
                    minute=f"{d['executeTime'].split(':')[1]}",
                    trigger='cron', args=(d['url'], d['type'], d['name'], s['userId'], d['_id']['$oid'])
                )
        await client.aclose()

        sched.start()

if os.getenv("ENVIRONMENT") == 'production':

    app = FastAPI(docs_url=None, redoc_url=None)
else:
    app = FastAPI()

@app.get("/")
async def read_root():
    print(sched.get_jobs())
    return {"Hello": "File Downloader Service"}

@app.delete("/scheduler/jobs/{id}",summary="刪除下載檔案排程")
async def delete(id):
    sched.remove_job(id)
    return {"status": True}

@app.post("/scheduler/jobs",summary="新增下載檔案排程")
async def post(request: Request):
    d = await request.json()
    sched.add_job(
        data_process.download,
        id=d['id'],
        hour=d["hour"], minute=d["minute"],
        trigger='cron', args=(d['args'][0],d['args'][1],d['args'][2],d['args'][3],d['args'][4])
    )
    return d

@app.post("/scheduler/jobs/{id}/run",summary="執行下載檔案排程") 
async def execute(id):
    sched.get_job(id).modify(next_run_time=datetime.datetime.now())

    return {"id":id}   
asyncio.create_task(init_scheduler())
