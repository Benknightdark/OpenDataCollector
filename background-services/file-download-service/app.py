import schedule
import time
import httpx
import csv
import re
def xml_to_json(file):
    return file


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
    return file


def download(url, data_type, file_name):
    '''
    csv => json
    xml => json
    xsl => json
    '''
    origin_data=httpx.get(url)

    if data_type == 'csv':
        print(data_type)
        origin_data=csv_to_json(origin_data.text.strip().replace('\xa0', '').split(('\n')))
    if data_type == 'xml':
        print(data_type)
    if data_type == 'xsl':
        print(data_type)
    print(origin_data)
download('https://quality.data.gov.tw/dq_download_csv.php?nid=138059&md5_url=0fa70d3715abf50fba7c12c6507fe7b4',
 'csv', '宜蘭縣勞工一般、特殊、巡迴體格及健康檢查指定醫院')    
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
