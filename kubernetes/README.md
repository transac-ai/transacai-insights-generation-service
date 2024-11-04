# Deploying IGS to Google Kubernetes Engine (GKE)

This guide provides instructions for deploying the IGS service to Google Kubernetes Engine (GKE).

## Steps

1. Confirm project.

```bash
gcloud config get-value project
```

2. Create the `igs-repo` repository in Artifact Registry.

```bash
gcloud artifacts repositories create igs-repo \
    --project=transac-ai \
    --repository-format=docker \
    --location=us-east1 \
    --description="Transac AI Insights Generation Service (IGS) Repository"
```

3. Build the `igs-gke` container image using [Cloud Build](https://cloud.google.com/build).

```bash
gcloud builds submit --tag us-east1-docker.pkg.dev/transac-ai/igs-repo/transac-ai-igs-gke:1.0.4 .
```

4. Create `transac-ai-gke` GKE cluster if not already created.

```bash
gcloud container clusters create-auto transac-ai-gke --location us-east1
```

5. Set secrets for environment variables.

```bash
kubectl patch secret generic transac-ai-igs-secrets \
--from-literal=transac-ai-igs-igs-api-key='' \
--from-literal=transac-ai-igs-google-genai-api-key='' \
--from-literal=transac-ai-igs-pbs-service-address='' \
--from-literal=transac-ai-igs-iss-service-address='' \
--from-literal=transac-ai-igs-iss-api-key='' \
--from-literal=transac-ai-igs-bootstrap-server='' \
--from-literal=transac-ai-igs-security-protocol='' \
--from-literal=transac-ai-igs-sasl-mechanisms='' \
--from-literal=transac-ai-igs-sasl-username='' \
--from-literal=transac-ai-igs-sasl-password=''
```

6. The deployment Kubernetes manifest is located at `kubernetes/deployment.yaml`. Apply the manifest to the GKE cluster.

```bash
kubectl apply -f kubernetes/deployment.yaml
```

7. You can use the below commands to check status of the deployment, service, and pods.

```bash
kubectl get deployments
kubectl get pods
```

8. There is also a `service.yaml` manifest that defines a Load Balancer service for the deployment for it to be accessible externally through TCP. Apply the manifest to the GKE cluster.

```bash
kubectl apply -f kubernetes/service.yaml
```

9. To access the service, you can use the Load Balancer IP address.

```bash
kubectl get services
```

The external IP address is listed under the column `EXTERNAL-IP` for the `transac-ai-igs-service` Service.

Output:

```bash
NAME                     TYPE           CLUSTER-IP       EXTERNAL-IP      PORT(S)        AGE
transac-ai-igs-service   LoadBalancer   **.***.***.***   **.***.***.***    80:31645/TCP   3h47m
```

10. You can now access and test the service using the external IP address.

Replace `<EXTERNAL-IP>` with the actual external IP address in the below command.

```bash
npx buf curl --http2-prior-knowledge --protocol grpc --schema . -H "Authorization: Bearer <IGS API Key>" -d '{"reqId":"gheedrherw","clientId":"test_client","promptId":2,"recordsSourceId":"SUPABASE","promptTemplatesSourceId":"SUPABASE","fromTime":"2019-12-29T06:39:22Z","toTime":"2019-12-29T23:49:22Z"}' \
http://0.0.0.0:8080/igs.v1.IGSService/GenerateInsights
```

11. Once testing completes, change the load balancer service to be accessible internally through the cluster only. Once done, re-apply the service manifest.

```bash
kubectl apply -f kubernetes/service.yaml
```

This service will only be used through the Workload Manager Service (WMS) so, it does not need to be accessible externally.

## Commands

### Patching Secrets

For example, for changing the address of PBS or ISS services.

```bash
kubectl patch secret transac-ai-igs-secrets \
--type='json' \
-p='[{"op": "replace", "path": "/data/transac-ai-igs-pbs-service-address", "value": "'$(echo -n "<value>" | base64)'"}]'
```

### Restarting Deployment

For initiating a rolling restart of the deployment.

```bash
kubectl rollout restart deployment transac-ai-igs-gke
```
