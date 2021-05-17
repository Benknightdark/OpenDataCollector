
from flask import Flask
from flask_apscheduler import APScheduler
import datetime
from bson.objectid import ObjectId
from bson import json_util
import os
from pymongo import MongoClient
import time
import httpx
import csv
import xmltodict
import json
import pyexcel as pe
import httpx
import logging

logging.basicConfig(level="INFO")


def convert_collection(data):
    '''
    轉換Collection資料形態
    '''
    return json.loads(json_util.dumps(data))


def db(db_name):
    '''
    取得MongoDB 資料庫
    '''
    if os.getenv('ENVIRONMENT') == 'production':
        db_uri = ('mongodb://root:example@mongo/')
    else:
        db_uri = ('mongodb://root:example@localhost:1769/')
    db_client = MongoClient(db_uri)
    return db_client[db_name]


def schedule_query():
    '''
    查詢所有使用者的排程資料
    '''
    return convert_collection(db('task')['schedule'].find())


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
    if data_type == 'csv':
        data = httpx.get(url)
        origin_data = csv_to_json(
            data.text.strip().replace('\xa0', '').split(('\n')))
    if data_type == 'xml':
        data = httpx.get(url)
        origin_data = xml_to_json(data.text)
    if data_type == 'xlsx':
        origin_data = xsl_to_json(url)
    history_data = db('task')['history'].find_one(
        {"userId": user_id, "scheduleId": schedule_id})
    if history_data == None:
        logging.info("新增")
        db('task')['history'].insert_one({
            "userId": user_id,
            "scheduleId": schedule_id,
            "data": [
                {
                    "createdTime": datetime.datetime.now(),
                    "record": origin_data
                }
            ]
        })
    else:
        logging.info("修改")
        new_data = history_data
        new_data['data'].append({
            "createdTime": datetime.datetime.now(),
            "record": origin_data
        })
        db('task')['history'].update_one({"userId": user_id, "scheduleId": schedule_id}, {
            '$push': {
                'data': {
                    "createdTime": datetime.datetime.now(),
                    "record": origin_data
                }
            }
        },
            True)
    logging.info(f'----------------END: {file_name}------------------------')


logging.info("執行下載檔案排程")

class Config:
    """App configuration."""
    JOBS = [      
    ]    
    schedule_list = schedule_query()
    for s in schedule_query():
        logging.info(f"使用者：{s['userId']}")
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
            JOBS.append({
                'id':d['_id']['$oid'],
                "func":f'{__name__}:download',
                'args':(d['url'], d['type'], d['name'], s['userId'], d['_id']['$oid']),
                "trigger": "cron",
                'hour':f"{d['executeTime'].split(':')[0]}",
                'minute':f"{d['executeTime'].split(':')[1]}"
            }) 
    logging.info(JOBS)           





    SCHEDULER_EXECUTORS = {"default": {"type": "threadpool", "max_workers": 20}}

    SCHEDULER_JOB_DEFAULTS = {"coalesce": False, "max_instances": 3}

    SCHEDULER_API_ENABLED = True


def job1(var_one, var_two):
    """Demo job function.
    :param var_two:
    :param var_two:
    """
    print(str(var_one) + " " + str(var_two))
logging.info(__name__)

if __name__ == '__main__':
    app = Flask(__name__)
    app.config.from_object(Config())

    scheduler = APScheduler()
    scheduler.init_app(app)
    scheduler.start()

    app.run()