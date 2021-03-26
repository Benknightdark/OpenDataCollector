# dapr show time
``` Bash
# docker compose Usage
docker compose up 

curl http://localhost:3333/api/python-service1
curl http://localhost:3333/api/python-service2

# start local regitry
docker run -d -p 5566:5000 --restart=always --name registry registry:latest

# build images
docker build --pull --rm -f "website\Dockerfile" -t moon791017/website:v0 "website"
docker build --pull --rm -f "python_service1\Dockerfile" -t moon791017/python_service1:v0 "python_service1"
docker build --pull --rm -f "python_service2\Dockerfile" -t moon791017/python_service2:v0 "python_service2"
docker push moon791017/website:v0
docker push moon791017/python_service1:v0
docker push moon791017/python_service2:v0

# Deploy redis service
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm install redis bitnami/redis
kubectl apply -f ./deploy/redis.yaml

# start node app
kubectl delete -f ./deploy/node.yaml
kubectl apply -f ./deploy/node.yaml
# export node app
minikube service  nodeapp

# start python app
kubectl delete -f ./deploy/python_service1.yaml
kubectl delete -f ./deploy/python_service2.yaml
kubectl apply -f ./deploy/python_service1.yaml
kubectl apply -f ./deploy/python_service2.yaml



# add/update the helm repo
helm repo add dapr https://dapr.github.io/helm-charts/
helm repo update
# See which chart versions are available
helm search repo dapr --devel --versions
# install dapr using helm
helm install  dapr dapr/dapr --version=1.0.1  --namespace dapr-system  --create-namespace  --values values.yml  --wait

```
# Reference
- integrate docker compose 
    - https://docs.microsoft.com/zh-tw/dotnet/architecture/dapr-for-net-developers/getting-started
    - https://github.com/Benknightdark/you-get/tree/develop/src/you_get
    