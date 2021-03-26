from typing import List, Optional
from fastapi import FastAPI
import requests
from bs4 import BeautifulSoup
import re
from pydantic import BaseModel


class DashboardItems(BaseModel):
    url: str
    count: int
    name: str


class Dashboard(BaseModel):
    title: str
    items: Optional[List[DashboardItems]] = []


app = FastAPI()
# app = FastAPI(docs_url=None, redoc_url=None)
root_url = "https://data.kcg.gov.tw"


@app.get("/")
def read_root():
    return {"Hello": "Kao Service"}


@app.get("/api/dashboard", response_model=Dashboard, summary='取得高雄OpenData Dashboard資料')
def dashboard():
    dashboard_res_data = {}
    r = requests.get(root_url)
    soup = BeautifulSoup(r.text, 'html.parser')
    dashboard_root = soup.find_all(attrs={"class", "box stats"})[1]
    dashboard_title = dashboard_root.div.h3.text
    dashboard_res_data['title'] = dashboard_title
    dashboard_res_data['items'] = []
    dashboard_ul = dashboard_root.find_all('ul')
    for ul in dashboard_ul:
        li_list = ul.find_all('li')
        for li in li_list:
            item_list = list(filter(lambda x: x != '', re.sub(
                "\n|\r|\s+", '-', li.a.text.strip()).split('-')))
            item_count = item_list[0]
            item_name = item_list[1]
            item_url = f"{root_url}{li.a['href']}"
            dashboard_res_data['items'].append({
                'url': item_url,
                'count': item_count,
                'name': item_name,
            })
    return dashboard_res_data


@app.get("/api/org", summary="組織列表")
def org():
    res_data = []
    r = requests.get(f'{root_url}/organization')
    soup = BeautifulSoup(r.text, 'html.parser')
    list_data = soup.find_all('li', attrs={'class': 'media-item'})
    print(list_data)
    for l in list_data:
        zero_count = l.find('span', attrs={'class': "count"})
        data_count=0
        if zero_count == None:
            data_count=(l.strong.text.split('個資料集')[0])
        res_data.append({
            'image': l.img['src'],
            'title': l.h3.text,
            'count':int(data_count) ,
            'url':f"{root_url}/{l.a['href']}"})
    return res_data

@app.get("/api/group", summary="群組列表")
def group():
    res_data = []
    r = requests.get(f'{root_url}/group')
    soup = BeautifulSoup(r.text, 'html.parser')
    list_data = soup.find_all('li', attrs={'class': 'media-item'})
    print(list_data)
    for l in list_data:
        res_data.append({
            'image': l.img['src'],
            'title': l.h3.text,
            'url':f"{root_url}/{l.a['href']}"})
    return res_data
@app.get("/api/dataset", summary="資料集列表")
def data_set(q: str):
    ''' 
    q parameter examples: \n
    (1) https://data.kcg.gov.tw/dataset \n
    (2) https://data.kcg.gov.tw/dataset?page=2 \n
    (3) https://data.kcg.gov.tw/dataset?q=%E9%87%91%E9%A1%8D \n
    '''
    res_data = {}
    r = requests.get(q)
    soup = BeautifulSoup(r.text, 'html.parser')
    search_form = soup.find(id='dataset-search-form')
    search_result = re.sub("\n|\r|\s+|-", '', search_form.h2.text)
    res_data['title'] = search_result
    res_data['data'] = []
    search_list = soup.find_all(attrs={'class': 'dataset-item'})
    for sl in search_list:
        content = sl.find(attrs={'class': 'dataset-content'})
        sl_data = {'name': sl.h3.a.text,
                   'url': f"{root_url}{sl.h3.a['href']}", 'content': content.div.text, 'data_type': []}
        data_type = sl.find('ul').find_all('li')
        for dt in data_type:
            sl_data['data_type'].append(dt.a.text)
        res_data['data'].append(sl_data)
    return res_data
