# 第一次建立OpendataCollector系統要跑的Scripts
``` Bash
# 啟動minikube
minikube start --cpus=4 --memory=4096  
minikube addons enable dashboard
minikube addons enable ingress
minikube addons enable registry
minikube addons enable metrics-server
# 安裝dapr
helm repo add dapr https://dapr.github.io/helm-charts/
helm repo update
helm upgrade --install dapr dapr/dapr --namespace dapr-system --create-namespace --set global.ha.enabled=true --wait
# 安裝redis
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm install redis bitnami/redis
kubectl apply -f ./minikube/redis.yaml
# 安裝mongodb
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install mongo  bitnami/mongodb --set auth.rootPassword=example
# 安裝SqlServer
kubectl create secret generic mssql --from-literal=SA_PASSWORD="MyC0m9l&xP@ssw0rd"
kubectl apply -f ./minikube/sqlserver.yaml
```
``` Powershell
# 建立secrets
kubectl delete secret opendatasecrets
kubectl create secret generic opendatasecrets `
--from-literal=client=client `
--from-literal=scope=api1 `
--from-literal=secret=9e564bd21af4a8ba8fd0cde4c38cec3de51ae169b13339777f5fdbd4a044f22c `
--from-literal=mongodb=mongodb://root:example@mongo-mongodb:27017/ `
--from-literal=sqlserver='Server=mssql-deployment;Database=IdentityServerDB;user id=sa;password=MyC0m9l&xP@ssw0rd'
```

``` Powershell
# 開啟local registry對外連線
docker run -d --rm -it --network=host alpine ash -c "apk add socat && socat TCP-LISTEN:5000,reuseaddr,fork TCP:host.docker.internal:5000"
kubectl port-forward --namespace kube-system $($(kubectl get po -n kube-system  -o=name  | Where-Object {$_ | Select-String "registry-"} | Where-Object {$_ -notlike  "*proxy*"} )-replace 'pod/', '') 5000:5000 

```

# 建立或更新OpenDataCollector相關服務
``` Bash

docker build --pull --rm --no-cache -f "api-service\kao-service\Dockerfile" -t kao-service:latest "api-service\kao-service"
docker tag kao-service:latest localhost:5000/kao-service:latest
docker push localhost:5000/kao-service:latest 
kubectl delete -f ./minikube/api-service/kao-service.yaml
kubectl apply -f ./minikube/api-service/kao-service.yaml


docker build --pull --rm  --no-cache -f "api-service\api-gateway-service\Dockerfile" -t api-gateway-service:latest "api-service\api-gateway-service"
docker tag api-gateway-service:latest localhost:5000/api-gateway-service:latest
docker push localhost:5000/api-gateway-service:latest
kubectl delete  -f ./minikube/api-service/api-gateway-service.yaml
kubectl apply -f ./minikube/api-service/api-gateway-service.yaml


docker build --pull --rm  --no-cache -f "api-service\tainan-service\Dockerfile" -t tainan-service:latest "api-service\tainan-service"
docker tag tainan-service:latest localhost:5000/tainan-service:latest
docker push localhost:5000/tainan-service:latest
kubectl delete -f ./minikube/api-service/tainan-service.yaml
kubectl apply -f ./minikube/api-service/tainan-service.yaml



docker build --pull --rm --no-cache -f "api-service\taichung-service\Dockerfile" -t taichung-service:latest "api-service\taichung-service"
docker tag taichung-service:latest localhost:5000/taichung-service:latest
docker push localhost:5000/taichung-service:latest
kubectl delete -f ./minikube/api-service/taichung-service.yaml
kubectl apply -f ./minikube/api-service/taichung-service.yaml


docker build --pull --rm --no-cache -f "api-service\pthg-service\Dockerfile" -t pthg-service:latest "api-service\pthg-service"
docker tag pthg-service:latest localhost:5000/pthg-service:latest
docker push localhost:5000/pthg-service:latest
kubectl delete -f ./minikube/api-service/pthg-service.yaml
kubectl apply -f ./minikube/api-service/pthg-service.yaml

docker build --pull --rm --no-cache -f "api-service\identity-service\Dockerfile" -t identity-service:latest "api-service\identity-service"
docker tag identity-service:latest localhost:5000/identity-service:latest
docker push localhost:5000/identity-service:latest
kubectl delete -f ./minikube/api-service/identity-service.yaml
kubectl apply -f ./minikube/api-service/identity-service.yaml


docker build --pull --rm --no-cache -f "api-service\account-service\Dockerfile" -t account-service:latest "api-service\account-service"
docker tag account-service:latest localhost:5000/account-service:latest
docker push localhost:5000/account-service:latest
kubectl delete -f ./minikube/api-service/account-service.yaml
kubectl apply -f ./minikube/api-service/account-service.yaml
```

``` Bash
# 開啟dashboard
minikube dashboard
# 開啟dapr dashboard
minikube service dapr-dashboard -n dapr-system
# 開啟api gateway服務
minikube service api-gateway-service
```
