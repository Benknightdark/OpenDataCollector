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
# 系統說明
| 服務名稱                 | 類型              | 用途                                          |
| ------------------------ | :---------------- | :-------------------------------------------- |
| nodeapp                  | 網站              | OpenDataCollector網站                         |
| nodeapp-dapr             | dapr side-car服務 | 處理nodeapp與dapr的http和grpc連線             |
| kao-service              | Api               | 高雄市OpenData Api                            |
| kao-service-dapr         | dapr side-car服務 | 處理kao-service與dapr的http和grpc連線         |
| tainan-service           | Api               | 台南市OpenData Api                            |
| tainan-service-dapr      | dapr side-car服務 | 處理tainan-service與dapr的http和grpc連線      |
| pthg-service             | Api               | 屏東縣OpenData Api                            |
| pthg-service-dapr        | dapr side-car服務 | 處理pthg-service與dapr的http和grpc連線        |
| taichung-service         | Api               | 台中市OpenData Api                            |
| taichung-service-dapr    | dapr side-car服務 | 處理taichung-service與dapr的http和grpc連線    |
| account-service          | Api               | 帳號相關Api                                   |
| account-service-dapr     | dapr side-car服務 | 處理account-service與dapr的http和grpc連線     |
| api-gateway-service      | Api               | 統一Api的連線網址，並透供Api的jwt授權驗證     |
| api-gateway-service-dapr | dapr side-car服務 | 處理api-gateway-service與dapr的http和grpc連線 |
| identity-service         | Api               | 授權管理Api                                   |
| placement                | dapr服務          | dapr 放置服務                                 |
| redis                    | redis資料庫       | 提供dpar狀態管理和執行pub/sub功能             |
| mongo                    | 資料庫            | 儲存與系統相關的資料，例如：使用者帳號資料    |
| mongo-express            | 網站              | 管理mongoDB的網站                             |

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
  



