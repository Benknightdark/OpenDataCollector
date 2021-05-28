from fastapi import FastAPI, Request
import os
import httpx
from apscheduler.schedulers.background import BackgroundScheduler
import asyncio
import os
import httpx
import csv
import xmltodict
import pyexcel as pe
import httpx
import logging
logging.basicConfig(level="INFO")


# def convert_collection(data):
#     '''
#     轉換Collection資料形態
#     '''
#     return json.loads(json_util.dumps(data))


# def db(db_name):
#     '''
#     取得MongoDB 資料庫
#     '''
#     if os.getenv('ENVIRONMENT') == 'production':
#         if os.getenv('MONGODB'):
#             db_uri = os.getenv('MONGODB')
#             print('================================')
#             print(db_uri)
#         else:
#             db_uri = ('mongodb://root:example@mongo/')
#     else:
#         db_uri = ('mongodb://root:example@localhost:1769/')
#     db_client = MongoClient(db_uri)
#     return db_client[db_name]


# def schedule_query():
#     '''
#     查詢所有使用者的排程資料
#     '''
#     return convert_collection(db('task')['schedule'].find())


def xml_to_json(file):
    obj = xmltodict.parse(file)
    return (obj)


def csv_to_json(file):
    new_data = []
    csv_data = list(csv.reader(file))
    col_name = csv_data[0]
    i = 0
    for c in csv_data:
        if i != 0:
            data = {}
            for i in range(len(col_name)):
                data[col_name[i]] = c[i]
            new_data.append(data)
        i = i+1
    return new_data


def xsl_to_json(url):
    sheet = pe.get_sheet(url=url)
    sheet_array = sheet.array
    new_data = []
    col_name = sheet_array[0]
    i = 0
    for c in sheet_array:
        if i != 0:
            data = {}
            for i in range(len(col_name)):
                data[col_name[i]] = c[i]
            new_data.append(data)
        i = i+1
    return new_data


def download(url, data_type, file_name, user_id, schedule_id):
    '''
    csv => json
    xml => json
    xslx => json
    '''
    logging.info(
        f'----------------START: {file_name}-----------------------------')

    origin_data = None
    data_type = str(data_type).lower()
    if data_type == 'csv':
        data = httpx.get(url)
        origin_data = csv_to_json(
            data.text.strip().replace('\xa0', '').split(('\n')))
    if data_type == 'xml':
        data = httpx.get(url)
        origin_data = xml_to_json(data.text)
    if data_type == 'xlsx':
        origin_data = xsl_to_json(url)
    # history_data = db('task')['history'].find_one(
    #     {"userId": user_id, "scheduleId": schedule_id})
    # if history_data == None:
    #     logging.info("新增")
    #     db('task')['history'].insert_one({
    #         "userId": user_id,
    #         "scheduleId": schedule_id,
    #         "data": [
    #             {
    #                 "createdTime": datetime.datetime.now(),
    #                 "record": origin_data
    #             }
    #         ]
    #     })
    # else:
    #     logging.info("修改")
    #     new_data = history_data
    #     new_data['data'].append({
    #         "createdTime": datetime.datetime.now(),
    #         "record": origin_data
    #     })
    #     db('task')['history'].update_one({"userId": user_id, "scheduleId": schedule_id}, {
    #         '$push': {
    #             'data': {
    #                 "createdTime": datetime.datetime.now(),
    #                 "record": origin_data
    #             }
    #         }
    #     },
    #         True)
    logging.info(f'----------------END: {file_name}------------------------')


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
                    download,
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


@app.delete("/scheduler/jobs/{id}")
async def delete(id):
    sched.remove_job(id)
    return {"status": True}


@app.post("/scheduler/jobs")
async def post(request: Request):
    # json_compatible_item_data = jsonable_encoder((await request.body()))
    d = await request.json()
    sched.add_job(
        download,
        id=d['_id']['$oid'],
        hour=f"{d['executeTime'].split(':')[0]}", minute=f"{d['executeTime'].split(':')[1]}",
        trigger='cron', args=(d['url'], d['type'], d['name'], s['userId'], d['_id']['$oid'])
    )
    return d
asyncio.create_task(init_scheduler())
