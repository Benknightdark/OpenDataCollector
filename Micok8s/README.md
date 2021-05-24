``` Bash
# Create Cluster
microk8s status --wait-ready
microk8s enable dashboard dns registry istio
microk8s kubectl get all --all-namespaces
microk8s dashboard-proxy
# local rigistry url
192.168.64.2:32000




```