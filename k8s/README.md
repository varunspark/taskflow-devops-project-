# Kubernetes Practice Guide

This is the "advanced" way to run TaskFlow — instead of `docker-compose`, Kubernetes
manages multiple copies of each service, restarts crashed containers automatically,
and rolls out updates without downtime.

**You only need this once you're comfortable with the Docker Compose version.**
Don't start here.

## Practicing locally with Minikube (free, runs on your laptop)

1. Install [Minikube](https://minikube.sigs.k8s.io/docs/start/) and `kubectl`
2. Start a local cluster:
   ```bash
   minikube start
   ```
3. Build your images and load them into Minikube's local registry (so you don't
   need Docker Hub for local practice):
   ```bash
   eval $(minikube docker-env)
   docker build -t taskflow-backend:latest ./backend
   docker build -t taskflow-frontend:latest ./frontend
   ```
4. Edit `backend-deployment.yaml` and `frontend-deployment.yaml`: change the
   `image:` line to just `taskflow-backend:latest` / `taskflow-frontend:latest`
   (no username prefix) and add `imagePullPolicy: Never` right below it, so
   Kubernetes uses your local image instead of trying to pull from Docker Hub.

5. Apply everything, in order:
   ```bash
   kubectl apply -f namespace.yaml
   kubectl apply -f secrets.yaml
   kubectl apply -f mysql-deployment.yaml
   kubectl apply -f mongo-deployment.yaml
   kubectl apply -f backend-deployment.yaml
   kubectl apply -f frontend-deployment.yaml
   ```

6. Watch pods come up:
   ```bash
   kubectl get pods -n taskflow -w
   ```
   (Ctrl+C to stop watching once everything shows `Running`)

7. Access the app:
   ```bash
   kubectl port-forward -n taskflow svc/frontend 3000:80
   ```
   Open http://localhost:3000

## Useful commands while practicing

```bash
# See all resources in the namespace
kubectl get all -n taskflow

# See why a pod won't start
kubectl describe pod <pod-name> -n taskflow

# Stream logs from a pod
kubectl logs -f <pod-name> -n taskflow

# Manually trigger a rolling restart (simulates a deploy)
kubectl rollout restart deployment/backend -n taskflow

# Watch a rollout happen live
kubectl rollout status deployment/backend -n taskflow

# Undo a bad deploy
kubectl rollout undo deployment/backend -n taskflow

# Delete everything when you're done
kubectl delete namespace taskflow
```

## What to explain in an interview about this setup

- **`readinessProbe` vs `livenessProbe`**: readiness controls traffic routing,
  liveness controls restarts. Getting these confused is a very common interview gap.
- **`maxUnavailable: 0`**: guarantees zero-downtime deploys — Kubernetes won't kill
  an old pod until a new healthy one is already serving traffic.
- **`resources.requests` / `limits`**: prevents one pod from starving the whole node
  of CPU/memory.
- **`emptyDir` vs `PersistentVolumeClaim`**: the manifests here use `emptyDir` for
  simplicity, meaning data is lost if the pod restarts. Mention that a real deployment
  would use a `PersistentVolumeClaim` backed by real cloud storage — this shows you
  understand the tradeoff, even in a demo project.
