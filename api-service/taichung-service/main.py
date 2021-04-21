from typing import List, Optional
from fastapi import FastAPI
import requests
from bs4 import BeautifulSoup
import re
from pydantic import BaseModel
import os
import httpx

def isValidURL(str):

    # Regex to check valid URL
    regex = ("^(http|https)://")

    # Compile the ReGex
    p = re.compile(regex)

    # If the string is empty
    # return false
    if (str == None):
        return False

    # Return if the string
    # matched the ReGex
    if(re.search(p, str)):
        return True
    else:
        return False


class DashboardItems(BaseModel):
    url: str
    count: int
    name: str


class Dashboard(BaseModel):
    title: str
    items: Optional[List[DashboardItems]] = []


if os.getenv("ENVIRONMENT") == 'Production':

    app = FastAPI(docs_url=None, redoc_url=None)
else:
    app = FastAPI()

# app = FastAPI(docs_url=None, redoc_url=None)
root_url = "https://opendata.taichung.gov.tw"


@app.get("/")
def read_root():
    return {"Hello": "Taichung Service"}


@app.get("/api/dashboard", response_model=Dashboard, summary='取得台中OpenData Dashboard資料')
async def dashboard():
    client = httpx.AsyncClient(http2=True)
    dashboard_res_data = {}
    r = await client.get(root_url)
    soup = BeautifulSoup(r.text, 'html.parser')
    dashboard_root = soup.find_all('div', attrs={"class", "media-body"})
    dashboard_res_data['title'] = '台中市政府資料開放 統計資訊'
    dashboard_res_data['items'] = []
    for data in dashboard_root:
        p_data = data.find_all('p')
        url = ''
        if p_data[1].text != 'API服務':
            url = f"{root_url}/{data.parent.parent['href']}"
            dashboard_res_data['items'].append({
                'url': url,
                'count': p_data[0].text,
                'name': p_data[1].text.replace('筆', ''),
            })

    await client.aclose()
    return dashboard_res_data


@app.get("/api/org", summary="組織列表")
async def org(page: Optional[int] = None):
    client = httpx.AsyncClient(http2=True)
    res_data = []
    page_str = ''
    if(page != None):
        page_str = f'?page={page}'
    r = await client.get(f'{root_url}/organization{page_str}')
    soup = BeautifulSoup(r.text, 'html.parser')
    list_data = soup.find_all('li', attrs={'class': 'media-item'})
    for l in list_data:
        zero_count = l.find('span', attrs={'class': "count"})
        data_count = 0
        if zero_count == None:
            data_count = (l.strong.text.split('個資料集')[0])
        img_url = l.img['src']
        if isValidURL(img_url) == False:
            img_url = f"{root_url}{img_url}"

        res_data.append({
            'image': img_url,
            'title': l.h3.text,
            'count': int(data_count),
            'url': f"{root_url}{l.a['href']}"})
    await client.aclose()
    return res_data


@app.get("/api/group", summary="群組列表")
async def group(page: Optional[int] = None):
    client = httpx.AsyncClient(http2=True)
    page_str = ''
    if(page != None):
        page_str = f'?page={page}'
    res_data = []
    r = await client.get(f'{root_url}/group{page_str}')
    soup = BeautifulSoup(r.text, 'html.parser')
    list_data = soup.find_all('li', attrs={'class': 'media-item'})
    for l in list_data:
        res_data.append({
            'image': l.img['src'],
            'title': l.h3.text,
            'url': f"{root_url}{l.a['href']}"})
    await client.aclose()
    return res_data


@app.get("/api/dataset", summary="資料集列表")
async def data_set(q: str):
    ''' 
    '''
    client = httpx.AsyncClient(http2=True)
    res_data = {}
    r = await client.get(q)
    soup = BeautifulSoup(r.text, 'html.parser')
    search_form = soup.find('form', attrs={'class': 'search-form'})
    search_result = re.sub("\n|\r|\s+|-", '', search_form.h2.text)
    res_data['title'] = search_result
    res_data['data'] = []
    search_list = soup.find_all(attrs={'class': 'dataset-item'})
    for sl in search_list:
        content = sl.find(attrs={'class': 'dataset-content'})
        sl_data = {'name': sl.h3.a.text,
                   'url': f"{root_url}{sl.h3.a['href']}", 'content': content.text, 'data_type': []}
        data_type = sl.find('ul').find_all('li')
        for dt in data_type:
            sl_data['data_type'].append(dt.a.text)
        res_data['data'].append(sl_data)
    await client.aclose()
    return res_data


@app.get("/api/dataset/detail", summary="資料集明細")
async def data_set_detail(q: str):
    print(q)
    client = httpx.AsyncClient(http2=True, timeout=60.0)
    res_data = {}
    r = await client.get(q)
    soup = BeautifulSoup(r.text, 'html.parser')
    context_module = soup.find('div', 'context-info')
    res_data['title'] = context_module.div.h1.text
    res_data['statics'] = []
    res_data['resources'] = []
    res_data['infomation'] = []
    static_data = context_module.div.div.find_all('dl')
    for sd in static_data:
        res_data['statics'].append({
            'name': sd.dt.text,
            'value': sd.dd.text
        })
    external_infomation = soup.find(
        'section', attrs={'class': 'additional-info'}).table.tbody.find_all('tr')
    for ei in external_infomation:
        res_data['infomation'].append({
            'name': ei.th.text,
            'value': ei.td.text
        })
    resource_list = soup.find_all('li', attrs={'class': 'resource-item'})
    for rl in resource_list:
        res_data['resources'].append({
            'detail': f"{root_url}{rl.a['href']}",
            'name': rl.a['title'],
            'type': rl.a.span.text,
            "description": re.sub("\n|\r|\s+|-", '', rl.p.text),
            'downloadLink': rl.div.ul.find_all('li')[1].a['href']
        })
    await client.aclose()
    return res_data
