import httpx
import httpx
import csv
import xmltodict
import pyexcel as pe
import httpx
import logging
logging.basicConfig(level="INFO")


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
    api_url = 'http://localhost:3500/v1.0/invoke/task-service/method'
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
    print(origin_data)
    history_data = httpx.get(
        f'{api_url}/api/history/{user_id}/{schedule_id}').json()
    if history_data == None:
        logging.info("新增")
        res = httpx.post(
            f'{api_url}/api/history/{user_id}/{schedule_id}', json={"data":origin_data})
        print(res)
    else:
        logging.info("修改")
        res = httpx.put(
            f'{api_url}/api/history/{user_id}/{schedule_id}', json={"data":origin_data})
        print(res)
    logging.info(f'----------------END: {file_name}------------------------')
