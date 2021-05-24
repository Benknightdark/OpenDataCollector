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

docker tag kao-service:latest localhost:5000/kao-service:latest
docker push localhost:5000/kao-service:latest
```