from typing import Optional
import requests
from bs4 import BeautifulSoup

def get_pthg_data(target: Optional[str] = '', page: Optional[int] = 1,org: Optional[str] = '',group: Optional[str] = ''):
    n_query='481C53E05C1D2D97'
    sms_query='354B0B57F2762613'
    root_url = f"https://www.pthg.gov.tw/Cus_OpenData_Default1.aspx?n={n_query}&sms={sms_query}"
    r1 = requests.get(root_url)
    soup = BeautifulSoup(r1.text, 'html.parser')
    view_state_value = soup.find('input', id='__VIEWSTATE')['value']
    event_validation_value = soup.find(
        'input', id='__EVENTVALIDATION')['value']
    view_state_generator_value = soup.find(
        'input', id='__VIEWSTATEGENERATOR')['value']
    headers = {
    'Connection': 'keep-alive',
    'Cache-Control': 'max-age=0',
    'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'Upgrade-Insecure-Requests': '1',
    'Origin': 'https://www.pthg.gov.tw',
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-User': '?1',
    'Sec-Fetch-Dest': 'document',
    'Referer': 'https://www.pthg.gov.tw/Cus_OpenData_Default1.aspx?n=481C53E05C1D2D97&sms=354B0B57F2762613',
    'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
    }
    params = (
        ('n', n_query),
        ('sms', sms_query),
    )
    data = {
    'ToolkitScriptManager1_HiddenField': '',
    '__EVENTTARGET': target,#ctl00$ContentPlaceHolder1$ctl04
    '__EVENTARGUMENT': '',

    '__VIEWSTATE': view_state_value,
    
    'ctl00$uscSiteMap1$hdNodeID': n_query,
    'ctl00$ContentPlaceHolder1$ddlCategory_Main': group,
    'ctl00$ContentPlaceHolder1$ddlContactUnit': org,
    'ctl00$ContentPlaceHolder1$txtKeyword': '',

    'ctl00$ContentPlaceHolder1$ddlPager': str(page),

    'ctl00$ContentPlaceHolder1$txtShowCount': '10',

    'ctl00$ContentPlaceHolder1$lbtnGo': 'Go',

    '__VIEWSTATEGENERATOR': view_state_generator_value,

    '__EVENTVALIDATION': event_validation_value,
    
    'ctl00$hdSiteLanguageSN': '1'
    }
    response = requests.post('https://www.pthg.gov.tw/Cus_OpenData_Default1.aspx', headers=headers, params=params,  data=data)    
    return response.text