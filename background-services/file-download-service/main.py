import schedule
import time
import httpx
import csv
import re
import xmltodict
import json
import pyexcel as pe
import httpx
from fastapi import FastAPI
import asyncio
import logging
def xml_to_json(file):
    obj = xmltodict.parse(file)
    return json.dumps(obj)


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


def download(url, data_type, file_name):
    '''
    csv => json
    xml => json
    xslx => json
    '''
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
    print(origin_data)
    print('------------------------------------------------------')
def job(index):
    print(index)

class BackgroundRunner:
    def __init__(self):
        self.value = 0

    async def run_main(self):
        await asyncio.sleep(0.1)
        logging.info("執行下載檔案排程")
        index_array = [1, 2, 3, 4, 5, 6]
        for i in index_array:
            schedule.every().day.at(f"10:5{i}").do(job, i)
            # schedule.every(3).seconds.do(job)
            # schedule.every(3).seconds.do(job2)
        # data=httpx.get("http://localhost:3500/v1.0/invoke/task-service/method/api/schedule")
        # logging.info(data.status_code)            
        while True:
            logging.info("執行下載檔案排程")
            schedule.run_pending()
            time.sleep(1)


runner = BackgroundRunner()
# download('https://quality.data.gov.tw/dq_download_csv.php?nid=138059&md5_url=0fa70d3715abf50fba7c12c6507fe7b4',
#  'csv', '宜蘭縣勞工一般、特殊、巡迴體格及健康檢查指定醫院')
# download('https://data.tycg.gov.tw/opendata/datalist/datasetMeta/download?id=ead9c6e1-ab53-47b4-b539-5f05412d0ad3&rid=b999335c-827e-44a1-b554-29d1be3e59d1 ',
#  'xml', '旅行時間偵測站設備資訊V2.0')
# download('https://www-ws.pthg.gov.tw/Upload/2015pthg/0/relfile/0/0/1240bd54-8fbd-4715-ab2b-9742a907b443.xls', 'xlsx', '關山鎮公告現值')


app = FastAPI()


@app.on_event('startup')
async def app_startup():
    asyncio.create_task(runner.run_main())

