# iStampit.io API Microservice

Minimal FastAPI service for OpenTimestamps detached hash stamping.

## Features

- Health check endpoint (`/healthz`)
- Hash stamping endpoint (`/stamp`)
- CORS enabled for istampit.io
- Uses istampit-cli v1.0.5 for stamping
- Containerized deployment ready

## Local Development

```bash
# Install dependencies
pip install -r requirements.txt
pip install istampit-cli==1.0.5

# Run locally
python app.py
# or
uvicorn app:app --host 0.0.0.0 --port 8080
```

## Docker

```bash
# Build
docker build -t istampit-api .

# Run
docker run -p 8080:8080 istampit-api
```

## Fly.io Deployment

```bash
# Login and launch
fly auth login
fly launch --no-deploy -n istampit-api

# Deploy
fly deploy

# Check status
fly status
fly logs
```

## API Endpoints

### GET /healthz

Health check with CLI availability status.

### POST /stamp

```json
{
  "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

Response:

```json
{
  "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "filename": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.ots",
  "size": 117,
  "receiptB64": "AQhTaGEyNTZIYXNo..."
}
