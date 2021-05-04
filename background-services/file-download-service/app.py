import schedule
import time
import httpx
import csv
import re
import xmltodict, json
import pyexcel as pe 
def xml_to_json(file):
    obj = xmltodict.parse(file)
    return json.dumps(obj)


def csv_to_json(file):
    new_data=[]
    csv_data =list(csv.reader(file)) 
    col_name=csv_data[0]
    i=0
    for c in csv_data:
        if i!=0:
            data={}
            for i in range(len(col_name)):
                data[col_name[i]]=c[i]
            new_data.append(data)
        i=i+1
    return new_data


def xsl_to_json(file):
    sheet = pe.get_sheet(file_content=file)
    return sheet.get_book_dict()


def download(url, data_type, file_name):
    '''
    csv => json
    xml => json
    xsl => json
    '''
    origin_data=None
    if data_type == 'csv':
        data=httpx.get(url)
        origin_data=csv_to_json(data.text.strip().replace('\xa0', '').split(('\n')))
    if data_type == 'xml':
        data=httpx.get(url)
        origin_data=xml_to_json(data.text)
    if data_type == 'xlsx':
        data=httpx.get(url)
        origin_data=xsl_to_json(data.text)
    print(origin_data)
# download('https://quality.data.gov.tw/dq_download_csv.php?nid=138059&md5_url=0fa70d3715abf50fba7c12c6507fe7b4',
#  'csv', '宜蘭縣勞工一般、特殊、巡迴體格及健康檢查指定醫院')   
# download('https://data.tycg.gov.tw/opendata/datalist/datasetMeta/download?id=ead9c6e1-ab53-47b4-b539-5f05412d0ad3&rid=b999335c-827e-44a1-b554-29d1be3e59d1 ',
#  'xml', '旅行時間偵測站設備資訊V2.0')  
download('https://www-ws.pthg.gov.tw/Upload/2015pthg/0/relfile/0/0/1240bd54-8fbd-4715-ab2b-9742a907b443.xls','xlsx','關山鎮公告現值')
# def job():
#     print("I'm working...")
#     print('-----------------------------')
# def job2():
#     print("I'm working2...")
#     print('-----------------------------')

# schedule.every(3).seconds.do(job)
# schedule.every(3).seconds.do(job2)
# while True:
#     schedule.run_pending()
#     time.sleep(1)
