# iStampit.io API Microservice

FastAPI service for OpenTimestamps hash stamping and verification.

## Features

- **Health check** endpoint (`/healthz`)
- **Hash stamping** endpoint (`/stamp`) - Create timestamps from SHA-256 hashes
- **Verification** endpoint (`/verify`) - Verify timestamp receipts and check Bitcoin confirmations
- **File stamping** endpoint (`/stamp-file`) - Upload and stamp files directly
- CORS enabled for istampit.io
- Uses istampit-cli v1.0.5 for stamping
- Containerized deployment ready
- Bitcoin attestation detection
- Perfect for CI/CD integration and automated workflows

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

### GET /

Root endpoint with service info and available endpoints.

### GET /healthz

Health check with CLI availability status.

**Response:**
```json
{
  "ok": true,
  "cli_available": true,
  "cli_version": "1.0.5"
}
```

### POST /stamp

Create an OpenTimestamps receipt for a SHA-256 hash.

**Request:**
```json
{
  "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

**Response:**
```json
{
  "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "filename": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.ots",
  "size": 117,
  "receiptB64": "AE9wZW5UaW1lc3RhbXBzAA...",
  "stampedAt": "2025-11-21T12:00:00Z",
  "calendars": ["https://alice.btc.calendar.opentimestamps.org"]
}
```

### POST /verify

Verify an OpenTimestamps receipt and check for Bitcoin confirmations.

**Request:**
```json
{
  "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "receiptB64": "AE9wZW5UaW1lc3RhbXBzAA..."
}
```

**Response:**
```json
{
  "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "verified": true,
  "attestations": [
    {
      "type": "bitcoin",
      "blockHeight": 870000,
      "confirmed": true
    }
  ],
  "bitcoinConfirmed": true,
  "blockHeight": 870000,
  "blockTime": null,
  "message": "Bitcoin attestation found - timestamp confirmed on blockchain"
}
```

### POST /stamp-file

Upload a file directly and get it timestamped (calculates hash automatically).

**Request:**
- Multipart form data with file upload

**Response:**
```json
{
  "filename": "document.pdf",
  "size": 1024,
  "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "receipt": {
    "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "size": 117,
  "receiptB64": "AQhTaGEyNTZIYXNo..."
}
