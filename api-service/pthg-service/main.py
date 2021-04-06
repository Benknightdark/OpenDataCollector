from typing import List, Optional
from fastapi import FastAPI, Depends
import requests
from bs4 import BeautifulSoup
import re
from pydantic import BaseModel
import os
from internal.data_service import get_pthg_data

# Function to validate URL
# using regular expression
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
root_url = "https://www.pthg.gov.tw/Cus_OpenData_Default1.aspx?n=481C53E05C1D2D97&sms=354B0B57F2762613"


@app.get("/")
def read_root():
    return {"Hello": "PTHG Service"}


# response_model=Dashboard,
@app.get("/api/dashboard",  response_model=Dashboard, summary='取得屏東縣OpenData Dashboard資料')
def dashboard(website_content: str = Depends(get_pthg_data)):
    root = BeautifulSoup(website_content, 'html.parser')
    title = '屏東縣政府資料開放 統計資訊'
    all_type = root.find('a', attrs={'title': '所有分類'})
    unit_type = root.find('a', attrs={'title': '所有單位'})
    dashboard_data = {
        'title': title,
        'items': [{
            'name': '主題',
            'count': int(all_type.parent.parent.span.text),
            'url': all_type['href'].replace("javascript:__doPostBack('", '').replace("','')", '')
        }, {
            'name': '組織',
            'count': int(unit_type.parent.parent.span.text),
            'url': unit_type['href'].replace("javascript:__doPostBack('", '').replace("','')", '')
        }]
    }
    return dashboard_data


@app.get("/api/org", summary="組織列表")
def org(website_content: str = Depends(get_pthg_data)):
    res_data = []
    root = BeautifulSoup(website_content, 'html.parser')
    li_data = root.find_all('div', attrs={'class': 'directory'})[
        1].ul.find_all('li')
    for li in li_data:
        res_data.append({
            'image': '',
            'title': li.p.a['title'],
            'count': int(li.span.text),
            'url': li.p.a['href'].replace("javascript:__doPostBack('", '').replace("','')", '')

        })
    return res_data


@app.get("/api/group", summary="群組列表")
def group(website_content: str = Depends(get_pthg_data)):
    res_data = []
    root = BeautifulSoup(website_content, 'html.parser')
    li_data = root.find('div', attrs={'class': 'directory'}).ul.find_all('li')
    for li in li_data:
        res_data.append({
            'image': '',
            'title': li.p.a['title'],
            'count': int(li.span.text),
            'url': li.p.a['href'].replace("javascript:__doPostBack('", '').replace("','')", '')
        })
    return res_data


@app.get("/api/dataset", summary="資料集列表")
def data_set(website_content: str = Depends(get_pthg_data)):
    '''
    ?page=1&target=ctl00$ContentPlaceHolder1$ctl34&org=屏東縣政府
    '''
    res_data = {}
    res_data['data'] = []
    root = BeautifulSoup(website_content, 'html.parser')
    title = f"共找到{root.find('span',id='ContentPlaceHolder1_lblTotalCount').text}筆"
    res_data['title'] = title

    li_data = root.find_all('div', attrs={'class': 'directory_list'})
    for li in li_data:
        res_data['data'].append({
            'name': li.div.a['title'],
            'url': f"https://www.pthg.gov.tw/{li.div.a['href']}",
            'content': re.sub("\n|\r|\s+|-", '', li.p.text),
            'data_type': []
        })

    return res_data


@app.get("/api/dataset/detail", summary="資料集明細")
def data_set_detail(q: str):
    res_data = {}
    r = requests.get(q)
    soup = BeautifulSoup(r.text, 'html.parser')
    root = soup.find('div', 'page_directory')
    res_data['title'] = root.div.text
    res_data['statics'] = []
    res_data['resources'] = []
    res_data['infomation'] = []
    external_infomation = root.find_all('tr')
    for ei in external_infomation:
        th_text=re.sub("\n|\r|\s+|-", '', ei.th.text)
        td_text=re.sub("\n|\r|\s+|-", '', ei.td.text) 
        if re.sub("\n|\r|\s+|-", '', ei.th.text) != '資料資源：':
            res_data['infomation'].append({
                'name':th_text ,
                'value':td_text
            })
        else:
            resources = ei.find_all('a')
          
            for resrouce in resources:
                download_link=''
                if isValidURL(resrouce['href']) == True:
                    download_link=resrouce['href']
                else:
                    download_link=f"https://www.pthg.gov.tw{resrouce['href']}"                  
                res_data['resources'].append({
                    'detail': resrouce['title'],
                    'name': td_text,
                    'type': resrouce['title'].split('.')[1],
                    "description": resrouce['title'],
                    'downloadLink': download_link
                })
    return res_data
