# iStampit API Usage Examples for SinAI Inc

This guide shows how to integrate the iStampit API into your workflows for timestamping and verifying work.

## Quick Start

Base URL: `https://istampit-api.fly.dev` (or your deployed instance)

## Use Case 1: Stamp Git Commits

Timestamp your commits to prove when code was written:

```bash
# Get commit hash
COMMIT_HASH=$(git rev-parse HEAD)

# Stamp it
curl -X POST https://istampit-api.fly.dev/stamp \
  -H "Content-Type: application/json" \
  -d "{\"hash\": \"$COMMIT_HASH\"}" \
  | jq -r '.receiptB64' > commit-${COMMIT_HASH:0:8}.ots.b64

# Decode and save receipt
base64 -d commit-${COMMIT_HASH:0:8}.ots.b64 > commit-${COMMIT_HASH:0:8}.ots
```

## Use Case 2: Stamp Release Artifacts

Timestamp your releases to prove authenticity:

```bash
# Calculate hash of release file
HASH=$(sha256sum myapp-v1.0.0.tar.gz | cut -d' ' -f1)

# Stamp it
curl -X POST https://istampit-api.fly.dev/stamp \
  -H "Content-Type: application/json" \
  -d "{\"hash\": \"$HASH\"}" \
  -o myapp-v1.0.0.ots
```

## Use Case 3: Stamp Files Directly

Upload and stamp any file:

```bash
# Stamp a document
curl -X POST https://istampit-api.fly.dev/stamp-file \
  -F "file=@document.pdf" \
  -o document.pdf.stamp.json

# Extract receipt
jq -r '.receipt.receiptB64' document.pdf.stamp.json | base64 -d > document.pdf.ots
```

## Use Case 4: Verify Timestamps

Verify a timestamp and check Bitcoin confirmation:

```bash
# Verify receipt
RECEIPT_B64=$(base64 -w0 document.pdf.ots)
HASH=$(sha256sum document.pdf | cut -d' ' -f1)

curl -X POST https://istampit-api.fly.dev/verify \
  -H "Content-Type: application/json" \
  -d "{\"hash\": \"$HASH\", \"receiptB64\": \"$RECEIPT_B64\"}" \
  | jq '.'
```

## Use Case 5: CI/CD Integration

### GitHub Actions

```yaml
name: Stamp Release

on:
  release:
    types: [published]

jobs:
  timestamp:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Calculate hash
        id: hash
        run: |
          HASH=$(git rev-parse HEAD)
          echo "hash=$HASH" >> $GITHUB_OUTPUT

      - name: Create timestamp
        run: |
          curl -X POST https://istampit-api.fly.dev/stamp \
            -H "Content-Type: application/json" \
            -d "{\"hash\": \"${{ steps.hash.outputs.hash }}\"}" \
            -o timestamp.json

          # Extract and save receipt
          jq -r '.receiptB64' timestamp.json | base64 -d > release.ots

      - name: Upload timestamp to release
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ github.event.release.upload_url }}
          asset_path: ./release.ots
          asset_name: release.ots
          asset_content_type: application/octet-stream
```

## Use Case 6: Python Integration

```python
import requests
import hashlib
import base64
import json

class IStampitClient:
    def __init__(self, base_url="https://istampit-api.fly.dev"):
        self.base_url = base_url

    def stamp_hash(self, hash_hex):
        """Create timestamp for a hash"""
        response = requests.post(
            f"{self.base_url}/stamp",
            json={"hash": hash_hex}
        )
        response.raise_for_status()
        return response.json()

    def stamp_file(self, file_path):
        """Stamp a file directly"""
        with open(file_path, 'rb') as f:
            response = requests.post(
                f"{self.base_url}/stamp-file",
                files={"file": f}
            )
        response.raise_for_status()
        return response.json()

    def verify(self, hash_hex, receipt_b64):
        """Verify a timestamp"""
        response = requests.post(
            f"{self.base_url}/verify",
            json={"hash": hash_hex, "receiptB64": receipt_b64}
        )
        response.raise_for_status()
        return response.json()

    def save_receipt(self, receipt_b64, output_path):
        """Save base64 receipt to file"""
        receipt_bytes = base64.b64decode(receipt_b64)
        with open(output_path, 'wb') as f:
            f.write(receipt_bytes)

# Usage
client = IStampitClient()

# Stamp a file
result = client.stamp_file("report.pdf")
print(f"Stamped {result['filename']}: {result['hash']}")

# Save receipt
client.save_receipt(result['receipt']['receiptB64'], 'report.pdf.ots')

# Later, verify it
with open('report.pdf.ots', 'rb') as f:
    receipt_b64 = base64.b64encode(f.read()).decode()

verification = client.verify(result['hash'], receipt_b64)
print(f"Bitcoin confirmed: {verification['bitcoinConfirmed']}")
if verification['blockHeight']:
    print(f"Block height: {verification['blockHeight']}")
```

## Use Case 7: Automated Documentation Stamping

Automatically stamp documentation updates:

```bash
#!/bin/bash
# stamp-docs.sh - Stamp all markdown files in docs/

for file in docs/**/*.md; do
    echo "Stamping $file..."

    # Calculate hash
    HASH=$(sha256sum "$file" | cut -d' ' -f1)

    # Create timestamp
    curl -s -X POST https://istampit-api.fly.dev/stamp \
        -H "Content-Type: application/json" \
        -d "{\"hash\": \"$HASH\"}" \
        | jq -r '.receiptB64' \
        | base64 -d > "${file}.ots"

    echo "Created ${file}.ots"
done

echo "All documentation timestamped!"
```

## Use Case 8: Verify Before Deployment

Add timestamp verification to your deployment pipeline:

```bash
#!/bin/bash
# verify-release.sh - Verify timestamp before deploying

ARTIFACT="$1"
RECEIPT="${ARTIFACT}.ots"

if [ ! -f "$RECEIPT" ]; then
    echo "❌ No timestamp receipt found for $ARTIFACT"
    exit 1
fi

# Calculate hash and verify
HASH=$(sha256sum "$ARTIFACT" | cut -d' ' -f1)
RECEIPT_B64=$(base64 -w0 "$RECEIPT")

RESULT=$(curl -s -X POST https://istampit-api.fly.dev/verify \
    -H "Content-Type: application/json" \
    -d "{\"hash\": \"$HASH\", \"receiptB64\": \"$RECEIPT_B64\"}")

VERIFIED=$(echo "$RESULT" | jq -r '.verified')
BITCOIN=$(echo "$RESULT" | jq -r '.bitcoinConfirmed')

if [ "$VERIFIED" = "true" ]; then
    echo "✅ Timestamp verified"
    if [ "$BITCOIN" = "true" ]; then
        BLOCK=$(echo "$RESULT" | jq -r '.blockHeight')
        echo "✅ Bitcoin confirmed at block $BLOCK"
        echo "Safe to deploy!"
        exit 0
    else
        echo "⚠️  Pending Bitcoin confirmation"
        echo "Proceed with caution"
        exit 0
    fi
else
    echo "❌ Timestamp verification failed!"
    exit 1
fi
```

## PowerShell Examples (Windows)

```powershell
# Stamp a file
$hash = (Get-FileHash document.pdf -Algorithm SHA256).Hash.ToLower()
$response = Invoke-RestMethod -Method Post -Uri "https://istampit-api.fly.dev/stamp" `
    -ContentType "application/json" `
    -Body (@{hash=$hash} | ConvertTo-Json)

# Save receipt
[Convert]::FromBase64String($response.receiptB64) | Set-Content "document.pdf.ots" -Encoding Byte

# Verify
$receiptBytes = [System.IO.File]::ReadAllBytes("document.pdf.ots")
$receiptB64 = [Convert]::ToBase64String($receiptBytes)
$verifyResponse = Invoke-RestMethod -Method Post -Uri "https://istampit-api.fly.dev/verify" `
    -ContentType "application/json" `
    -Body (@{hash=$hash; receiptB64=$receiptB64} | ConvertTo-Json)

Write-Host "Bitcoin confirmed: $($verifyResponse.bitcoinConfirmed)"
```

## Best Practices

1. **Always save receipts**: Store `.ots` files alongside your artifacts
2. **Verify before claiming**: Check Bitcoin confirmation before publishing timestamps
3. **Automate in CI/CD**: Integrate stamping into your build pipeline
4. **Keep original files**: You need the original file to verify the timestamp
5. **Wait for confirmation**: Bitcoin confirmations take 6-24 hours typically
6. **Document hashes**: Keep a record of what you stamped and when

## Rate Limits

The API has the following rate limits:
- Stamping: 10 requests per minute
- Verification: 30 requests per minute
- File uploads: 5 MB max file size

## Support

For issues or questions:
- GitHub: https://github.com/SinAi-Inc/iStampit.io
- API Status: https://istampit-api.fly.dev/healthz
