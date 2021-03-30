from typing import List, Optional
from fastapi import FastAPI
import requests
from bs4 import BeautifulSoup
import re
from pydantic import BaseModel
import os 

class DashboardItems(BaseModel):
    url: str
    count: int
    name: str


class Dashboard(BaseModel):
    title: str
    items: Optional[List[DashboardItems]] = []

if os.getenv("ENVIRONMENT")=='Production':

    app = FastAPI(docs_url=None, redoc_url=None)
else:
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
def org( page: Optional[int] = None):
    res_data = []
    page_str=''
    if(page!=None):
        page_str=f'?page={page}'
    r = requests.get(f'{root_url}/organization{page_str}')
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
def group(page: Optional[int] = None):
    page_str=''
    if(page!=None):
        page_str=f'?page={page}'    
    res_data = []
    r = requests.get(f'{root_url}/group{page_str}')
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
    參數q的範例: 
    - https://data.kcg.gov.tw/dataset 
    - https://data.kcg.gov.tw/dataset?page=2 
    - https://data.kcg.gov.tw/dataset?q=%E9%87%91%E9%A1%8D 
    '''
    res_data = {}
    r = requests.get(q)
    soup = BeautifulSoup(r.text, 'html.parser')
    search_form = soup.find('form',attrs={'class':'search-form'})
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

@app.get("/api/dataset/detail", summary="資料集明細")
def data_set_detail(q: str):
    ''' 
    參數q的範例: 
    - https://data.kcg.gov.tw/dataset/estimate-committee-propose 
    '''
    res_data = {}
    r = requests.get(q)
    soup = BeautifulSoup(r.text, 'html.parser')
    context_module=soup.find('div','context-info')
    res_data['title']=context_module.div.h1.text
    res_data['statics']=[]
    res_data['resources']=[]
    static_data=context_module.div.div.find_all('dl')
    for sd in static_data:
        res_data['statics'].append({
            'name':sd.dt.text,
            'value':sd.dd.text
        })
    resource_list=soup.find_all('li',attrs={'class':'resource-item'})
    for rl in resource_list:
        res_data['resources'].append({
            'detail' : f"{root_url}{rl.a['href']}",
            'name':rl.a['title'],
            'type':rl.a.span.text,
            "description":re.sub("\n|\r|\s+|-", '', rl.p.text),
            'downloadLink':rl.div.ul.find_all('li')[1].a['href']

        })
    return res_data
