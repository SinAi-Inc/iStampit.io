# iStampit API - Quick Reference for SinAI Inc

## 🚀 API Endpoint

**Production**: `https://istampit-api.fly.dev`  
**Local Dev**: `http://localhost:8080`

## 📝 Common Commands

### Stamp a File

```bash
# Calculate hash
HASH=$(sha256sum myfile.pdf | cut -d' ' -f1)

# Create timestamp
curl -X POST https://istampit-api.fly.dev/stamp \
  -H "Content-Type: application/json" \
  -d "{\"hash\": \"$HASH\"}" | jq -r '.receiptB64' | base64 -d > myfile.pdf.ots
```

### Stamp with File Upload

```bash
curl -X POST https://istampit-api.fly.dev/stamp-file \
  -F "file=@document.pdf" \
  -o stamp-result.json
```

### Verify a Timestamp

```bash
HASH=$(sha256sum myfile.pdf | cut -d' ' -f1)
RECEIPT=$(base64 -w0 myfile.pdf.ots)

curl -X POST https://istampit-api.fly.dev/verify \
  -H "Content-Type: application/json" \
  -d "{\"hash\": \"$HASH\", \"receiptB64\": \"$RECEIPT\"}" | jq '.'
```

## 🐍 Python Client

```python
import requests
import hashlib
import base64

API = "https://istampit-api.fly.dev"

# Stamp
hash_hex = hashlib.sha256(open("file.pdf", "rb").read()).hexdigest()
response = requests.post(f"{API}/stamp", json={"hash": hash_hex})
receipt_b64 = response.json()["receiptB64"]

# Save receipt
with open("file.pdf.ots", "wb") as f:
    f.write(base64.b64decode(receipt_b64))

# Verify
with open("file.pdf.ots", "rb") as f:
    receipt_b64 = base64.b64encode(f.read()).decode()
verify = requests.post(f"{API}/verify", json={"hash": hash_hex, "receiptB64": receipt_b64})
print(f"Bitcoin confirmed: {verify.json()['bitcoinConfirmed']}")
```

## 💻 PowerShell (Windows)

```powershell
# Stamp
$hash = (Get-FileHash file.pdf -Algorithm SHA256).Hash.ToLower()
$response = Invoke-RestMethod -Method Post `
    -Uri "https://istampit-api.fly.dev/stamp" `
    -ContentType "application/json" `
    -Body (@{hash=$hash} | ConvertTo-Json)
[Convert]::FromBase64String($response.receiptB64) | Set-Content "file.pdf.ots" -Encoding Byte

# Verify
$receiptB64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes("file.pdf.ots"))
$verify = Invoke-RestMethod -Method Post `
    -Uri "https://istampit-api.fly.dev/verify" `
    -ContentType "application/json" `
    -Body (@{hash=$hash; receiptB64=$receiptB64} | ConvertTo-Json)
Write-Host "Bitcoin confirmed: $($verify.bitcoinConfirmed)"
```

## 🔧 GitHub Actions Integration

```yaml
- name: Timestamp Release
  run: |
    HASH=$(git rev-parse HEAD)
    curl -X POST https://istampit-api.fly.dev/stamp \
      -H "Content-Type: application/json" \
      -d "{\"hash\": \"$HASH\"}" \
      -o timestamp.json
    jq -r '.receiptB64' timestamp.json | base64 -d > release.ots

- name: Upload Timestamp
  uses: actions/upload-artifact@v3
  with:
    name: timestamp
    path: release.ots
```

## 📊 Response Formats

### Stamp Response
```json
{
  "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "filename": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.ots",
  "size": 117,
  "receiptB64": "AE9wZW5UaW1lc3RhbXBzAA...",
  "stampedAt": "2025-11-21T12:00:00Z",
  "calendars": []
}
```

### Verify Response (Pending)
```json
{
  "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "verified": true,
  "attestations": [{"type": "calendar", "confirmed": false, "pending": true}],
  "bitcoinConfirmed": false,
  "blockHeight": null,
  "blockTime": null,
  "message": "Timestamp verified but not yet confirmed on Bitcoin blockchain"
}
```

### Verify Response (Confirmed)
```json
{
  "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "verified": true,
  "attestations": [{"type": "bitcoin", "blockHeight": 870000, "confirmed": true}],
  "bitcoinConfirmed": true,
  "blockHeight": 870000,
  "blockTime": null,
  "message": "Bitcoin attestation found - timestamp confirmed on blockchain"
}
```

## ⏱️ Timeline

1. **Immediate**: Timestamp created, calendar servers notified (117 bytes)
2. **1-6 hours**: Calendar aggregation (600-800 bytes)
3. **6-24 hours**: Bitcoin block inclusion (2-5 KB with attestation)

## 📚 Documentation

- **Full API Docs**: `api/README.md`
- **Usage Examples**: `api/USAGE_EXAMPLES.md`
- **Test Suite**: `api/test_api.py`

## 🆘 Quick Test

```bash
# Health check
curl https://istampit-api.fly.dev/healthz

# Should return:
# {"ok": true, "cli_available": true, "cli_version": "1.0.5"}
```

## 🔑 Best Practices for SinAI Inc

1. **Always save .ots receipts** alongside original files
2. **Verify before publishing** to check Bitcoin confirmation
3. **Automate in CI/CD** for consistent timestamping
4. **Document what you stamp** - keep ledger of timestamps
5. **Wait 24 hours** for Bitcoin confirmation
6. **Keep originals** - you need the file to verify timestamps

## 📞 Support

- **API Status**: https://istampit-api.fly.dev/healthz
- **GitHub Issues**: https://github.com/SinAi-Inc/iStampit.io/issues
- **Documentation**: See `api/USAGE_EXAMPLES.md` for detailed examples
