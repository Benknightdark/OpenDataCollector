# OpenDataCollector


``` Bash
# 系統啟動指令
docker compose up 
開啟 http://localhost:3333

# 其他指令
net stop winnat
net start winnat
curl  POST 'http://localhost:5000/connect/token' --header 'Content-Type: application/x-www-form-urlencoded' --data-urlencode 'client_id=client' --data-urlencode 'client_secret=secret' --data-urlencode 'scope=api1' --data-urlencode 'grant_type=client_credentials'
```
# 服務說明
| 服務名稱                 | 類型  | 用途 | 相依服務 |
| ------------------------ | :---: | ---: | -------: |
| nodeapp                  | 02:10 |  500 |        0 |
| nodeapp-dapr             | 02:40 |  800 |      200 |
| kao-service              | 03:30 | 1000 |      800 |
| kao-service-dapr         | 03:30 | 1000 |      800 |
| tainan-service           | 03:30 | 1000 |      800 |
| tainan-service-dapr      | 03:30 | 1000 |      800 |
| pthg-service             | 03:30 | 1000 |      800 |
| pthg-service-dapr        | 03:30 | 1000 |      800 |
| taichung-service         | 03:30 | 1000 |      800 |
| taichung-service-dapr    | 03:30 | 1000 |      800 |
| account-service          | 03:30 | 1000 |      800 |
| account-service-dapr     | 03:30 | 1000 |      800 |
| api-gateway-service      | 03:30 | 1000 |      800 |
| api-gateway-service-dapr | 03:30 | 1000 |      800 |
| identity-service         | 03:30 | 1000 |      800 |
| kaplacemento             | 03:30 | 1000 |      800 |
| redis                    | 03:30 | 1000 |      800 |
| mongo                    | 03:30 | 1000 |      800 |
| mongo-express            | 03:30 | 1000 |      800 |

# 系統畫面
- 各縣市Open Data統計資料
<center><img src="https://github.com/Benknightdark/OpenDataCollector/blob/main/screenshot/1.png?raw=true" />
</center>

- 組織資料
<center><img src="https://github.com/Benknightdark/OpenDataCollector/blob/main/screenshot/2.png?raw=true" />
</center>

- 群組資料
<center><img src="https://github.com/Benknightdark/OpenDataCollector/blob/main/screenshot/3.png?raw=true" />
</center>

- Open Data列表
<center><img src="https://github.com/Benknightdark/OpenDataCollector/blob/main/screenshot/4.png?raw=true" />
</center>

- Open Data明細
<center><img src="https://github.com/Benknightdark/OpenDataCollector/blob/main/screenshot/5.png?raw=true" />
</center>
# Reference
- integrate docker compose 
    - https://docs.microsoft.com/zh-tw/dotnet/architecture/dapr-for-net-developers/getting-started
    - https://opendata.taichung.gov.tw/
    - https://www.pthg.gov.tw/Cus_OpenData_Default1.aspx?n=481C53E05C1D2D97&sms=354B0B57F2762613
- auth 
    - https://blog.logrocket.com/using-authentication-in-next-js/
    - https://next-auth.js.org/providers/credentials
- form
  - https://react-hook-form.com/get-started/
  - https://github.com/formium/formik/
- https://stackoverflow.com/questions/54312304/identity-server-add-custom-parameters-to-the-json-response-from-the-token-endp
  



