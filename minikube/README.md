``` Bash
# delete 
minikube delete 
# start
minikube start --cpus=4 --memory=4096  
minikube addons enable dashboard
minikube addons enable ingress
minikube addons enable registry
minikube addons enable metrics-server
minkube dashbaord
# stop
minkube stop

# 開啟local registry對外連線
docker run -d --rm -it --network=host alpine ash -c "apk add socat && socat TCP-LISTEN:5000,reuseaddr,fork TCP:host.docker.internal:5000"
# kubectl port-forward --namespace kube-system registry-m9pml 5000:5000
kubectl port-forward --namespace kube-system $($(kubectl get po -n kube-system  -o=name  | Where-Object {$_ | Select-String "registry-"} | Where-Object {$_ -notlike  "*proxy*"} )-replace 'pod/', '') 5000:5000 

########################################################################
# 使用helm3安裝dapr
helm repo add dapr https://dapr.github.io/helm-charts/
helm repo update
helm upgrade --install dapr dapr/dapr --namespace dapr-system --create-namespace --set global.ha.enabled=true --wait
helm uninstall dapr -n dapr-system

###############################################
# 安裝redis
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm install redis bitnami/redis
kubectl apply -f ./minikube/redis.yaml
# 啟動服務
docker tag kao-service:latest localhost:5000/kao-service:latest
docker push localhost:5000/kao-service:latest
kubectl apply -f ./minikube/kao-service.yaml

docker tag api-gateway-service:latest localhost:5000/api-gateway-service:latest
docker push localhost:5000/api-gateway-service:latest
kubectl apply -f ./minikube/api-gateway-service.yaml




```