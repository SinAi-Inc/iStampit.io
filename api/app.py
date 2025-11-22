"""
iStampit.io FastAPI Microservice
API for OpenTimestamps hash stamping and verification using istampit-cli
"""
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, Any
import subprocess
import base64
import os
import tempfile
import logging
import hashlib
import json
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="iStampit API",
    description="API for OpenTimestamps hash stamping and verification",
    version="2.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://istampit.io", "https://www.istampit.io", "http://localhost:3000"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    max_age=86400,
)

class StampRequest(BaseModel):
    hash: str = Field(..., description="SHA-256 hash in hex format (64 characters)")

    @field_validator('hash')
    @classmethod
    def validate_hash(cls, v):
        if not isinstance(v, str):
            raise ValueError('Hash must be a string')
        v = v.strip().lower()
        if len(v) != 64:
            raise ValueError('Hash must be exactly 64 characters')
        if not all(c in '0123456789abcdef' for c in v):
            raise ValueError('Hash must contain only hex characters')
        return v

class StampResponse(BaseModel):
    hash: str
    filename: str
    size: int
    receiptB64: str
    stampedAt: str
    calendars: list[str] = []

class VerifyRequest(BaseModel):
    hash: str = Field(..., description="SHA-256 hash in hex format (64 characters)")
    receiptB64: str = Field(..., description="Base64-encoded OpenTimestamps receipt")

    @field_validator('hash')
    @classmethod
    def validate_hash(cls, v):
        if not isinstance(v, str):
            raise ValueError('Hash must be a string')
        v = v.strip().lower()
        if len(v) != 64:
            raise ValueError('Hash must be exactly 64 characters')
        if not all(c in '0123456789abcdef' for c in v):
            raise ValueError('Hash must contain only hex characters')
        return v

class VerifyResponse(BaseModel):
    hash: str
    verified: bool
    attestations: list[Dict[str, Any]] = []
    bitcoinConfirmed: bool
    blockHeight: Optional[int] = None
    blockTime: Optional[str] = None
    message: str

@app.get("/")
def root():
    return {
        "service": "iStampit API",
        "version": "2.0.0",
        "status": "ok",
        "endpoints": {
            "stamp": "POST /stamp - Create timestamp for a hash",
            "verify": "POST /verify - Verify timestamp receipt",
            "stampFile": "POST /stamp-file - Stamp a file directly",
            "health": "GET /healthz - Health check"
        }
    }

@app.get("/healthz")
def healthz():
    """Health check endpoint"""
    try:
        # Test CLI availability - try direct command
        result = subprocess.run(
            ["istampit", "--version"],
            capture_output=True,
            text=True,
            timeout=5
        )
        cli_available = result.returncode == 0
        return {
            "ok": True,
            "cli_available": cli_available,
            "cli_version": result.stdout.strip() if cli_available else None
        }
    except subprocess.TimeoutExpired:
        return {"ok": False, "error": "CLI timeout"}
    except FileNotFoundError:
        return {"ok": False, "error": "CLI not found"}
    except Exception as e:
        return {"ok": False, "error": str(e)}

@app.post("/stamp", response_model=StampResponse)
def stamp(req: StampRequest):
    """
    Create an OpenTimestamps receipt for a given SHA-256 hash
    """
    hash_hex = req.hash
    logger.info(f"Stamping hash: {hash_hex}")

    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            output_file = os.path.join(temp_dir, f"{hash_hex}.ots")

            # Run istampit CLI - try direct command first
            result = subprocess.run([
                "istampit", "stamp",
                "--hash", hash_hex,
                "--out", output_file
            ], capture_output=True, text=True, timeout=30, check=True)

            # Check if output file exists and has content
            if not os.path.exists(output_file):
                raise HTTPException(status_code=500, detail="Receipt file not created")

            file_size = os.path.getsize(output_file)
            if file_size == 0:
                raise HTTPException(status_code=500, detail="Empty receipt file generated")

            # Read and encode the receipt
            with open(output_file, "rb") as f:
                receipt_data = f.read()

            receipt_b64 = base64.b64encode(receipt_data).decode('utf-8')

            logger.info(f"Successfully stamped hash {hash_hex}, receipt size: {file_size} bytes")

            # Extract calendar servers from output (if available in CLI output)
            calendars = []
            if result.stdout:
                for line in result.stdout.split('\n'):
                    if 'calendar' in line.lower():
                        calendars.append(line.strip())

            return StampResponse(
                hash=hash_hex,
                filename=f"{hash_hex}.ots",
                size=file_size,
                receiptB64=receipt_b64,
                stampedAt=datetime.utcnow().isoformat() + 'Z',
                calendars=calendars
            )

    except subprocess.CalledProcessError as e:
        logger.error(f"CLI error for hash {hash_hex}: {e.stderr}")
        if "empty timestamp" in e.stderr.lower():
            raise HTTPException(status_code=500, detail="Empty timestamp serialization error")
        raise HTTPException(status_code=500, detail=f"Stamping failed: {e.stderr}")

    except subprocess.TimeoutExpired:
        logger.error(f"Timeout stamping hash {hash_hex}")
        raise HTTPException(status_code=500, detail="Stamping operation timed out")

    except Exception as e:
        logger.error(f"Unexpected error stamping hash {hash_hex}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

@app.post("/verify", response_model=VerifyResponse)
def verify(req: VerifyRequest):
    """
    Verify an OpenTimestamps receipt for a given hash
    """
    hash_hex = req.hash
    logger.info(f"Verifying hash: {hash_hex}")

    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            # Write receipt file
            receipt_file = os.path.join(temp_dir, f"{hash_hex}.ots")
            receipt_data = base64.b64decode(req.receiptB64)
            with open(receipt_file, "wb") as f:
                f.write(receipt_data)

            # Run istampit CLI verify
            result = subprocess.run([
                "istampit", "verify",
                "--hash", hash_hex,
                "--receipt", receipt_file
            ], capture_output=True, text=True, timeout=30)

            # Parse verification result
            verified = result.returncode == 0
            attestations = []
            bitcoin_confirmed = False
            block_height = None
            block_time = None
            message = "Verification failed"

            if verified:
                # Check for Bitcoin attestation marker in receipt
                if len(receipt_data) > 200:  # Bitcoin proofs are typically 2-5KB
                    for i in range(len(receipt_data) - 1):
                        if receipt_data[i] == 0x05 and receipt_data[i + 1] == 0x88:
                            bitcoin_confirmed = True
                            message = "Bitcoin attestation found - timestamp confirmed on blockchain"

                            # Try to extract block height (simplified parsing)
                            try:
                                # Block height is stored after the 0x05 0x88 marker
                                if i + 6 < len(receipt_data):
                                    block_bytes = receipt_data[i+2:i+6]
                                    block_height = int.from_bytes(block_bytes, byteorder='big')
                            except:
                                pass

                            attestations.append({
                                "type": "bitcoin",
                                "blockHeight": block_height,
                                "confirmed": True
                            })
                            break

                if not bitcoin_confirmed:
                    message = "Timestamp verified but not yet confirmed on Bitcoin blockchain"
                    attestations.append({
                        "type": "calendar",
                        "confirmed": False,
                        "pending": True
                    })
            else:
                message = result.stderr if result.stderr else "Verification failed"

            logger.info(f"Verification result for {hash_hex}: verified={verified}, bitcoin={bitcoin_confirmed}")

            return VerifyResponse(
                hash=hash_hex,
                verified=verified,
                attestations=attestations,
                bitcoinConfirmed=bitcoin_confirmed,
                blockHeight=block_height,
                blockTime=block_time,
                message=message
            )

    except subprocess.TimeoutExpired:
        logger.error(f"Timeout verifying hash {hash_hex}")
        raise HTTPException(status_code=500, detail="Verification operation timed out")

    except Exception as e:
        logger.error(f"Unexpected error verifying hash {hash_hex}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

@app.post("/stamp-file")
async def stamp_file(file: UploadFile = File(...)):
    """
    Stamp a file directly - calculates hash and creates timestamp
    """
    logger.info(f"Stamping file: {file.filename}")

    try:
        # Read file and calculate hash
        content = await file.read()
        hash_hex = hashlib.sha256(content).hexdigest()

        logger.info(f"File {file.filename} has hash: {hash_hex}")

        # Create stamp request
        stamp_req = StampRequest(hash=hash_hex)
        stamp_response = stamp(stamp_req)

        return {
            "filename": file.filename,
            "size": len(content),
            "hash": hash_hex,
            "receipt": stamp_response.model_dump()
        }

    except Exception as e:
        logger.error(f"Error stamping file {file.filename}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"File stamping failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
