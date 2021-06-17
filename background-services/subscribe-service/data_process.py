import httpx
import csv
import xmltodict
import pyexcel as pe
from pymongo import MongoClient
import os
from bson import json_util
import json
import datetime
import logging
import secret_service
import calendar;
import time;
logging.basicConfig(level="INFO")


def convert_collection(data):
    '''
    轉換Collection資料形態
    '''
    return json.loads(json_util.dumps(data))


async def db(db_name):
    '''
    取得MongoDB 資料庫
    '''
    if os.getenv('ENVIRONMENT') == 'production':
        if os.getenv('MONGODB'):
            db_uri = os.getenv('MONGODB')
        else:
            db_uri = (await secret_service.get_jwt_config())['mongodb']
    else:
        db_uri = ('mongodb://root:example@localhost:1769/')
    db_client = MongoClient(db_uri)
    return db_client[db_name]


async def add_history(user_id, schedule_id, origin_data):
    '''
    新增下載檔案到資料庫
    '''
    inesert_data = (await db('task'))['history'].insert_one({
        "userId": user_id,
        "scheduleId": schedule_id,
        "data": [
            {
                "createdTime": datetime.datetime.now(),
                "record": origin_data,
                "id":str(calendar.timegm(time.gmtime()))
            }
        ]
    })
    return inesert_data.inserted_id


async def update_history(user_id, schedule_id, origin_data):
    '''
    更新下載檔案到資料庫
    '''
    update_data = (await db('task'))['history'].update_one({"userId": user_id, "scheduleId": schedule_id}, {
        '$push': {
            'data': {
                "createdTime": datetime.datetime.now(),
                "record": origin_data,
                "id":str(calendar.timegm(time.gmtime()))
            }
        }
    },
        True)
    return update_data.raw_result


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


def download(req_data):
    '''
    csv => json
    xml => json
    xslx => json
    '''
    logging.info(req_data)
    file_name = req_data['fileName']
    data_type = req_data['dataType']
    url = req_data['url']

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
    if data_type == 'json':
        origin_data = httpx.get(url).json()
    logging.info(f'----------------END: {file_name}------------------------')

    return origin_data


async def add_file(req_data):
    download_data = download(req_data)
    inserted_id = await add_history(
        req_data["userId"], req_data["scheduleId"], download_data)
    print(inserted_id)


async def update_file(req_data):
    download_data = download(req_data)
    raw_result = await update_history(
        req_data["userId"], req_data["scheduleId"], download_data)
    print(raw_result)
