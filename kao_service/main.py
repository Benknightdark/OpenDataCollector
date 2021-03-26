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


@app.get("/api/dashboard", response_model=Dashboard)
def dashboard():
    ''' 取得高雄OpenData Dashboard資料 '''
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
