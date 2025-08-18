"""
iStampit.io FastAPI Microservice
Minimal API for detached hash stamping using istampit-cli
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
import subprocess
import base64
import os
import tempfile
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="iStampit API",
    description="Minimal API for OpenTimestamps detached hash stamping",
    version="1.0.0"
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

@app.get("/")
def root():
    return {"service": "iStampit API", "version": "1.0.0", "status": "ok"}

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

            return StampResponse(
                hash=hash_hex,
                filename=f"{hash_hex}.ots",
                size=file_size,
                receiptB64=receipt_b64
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
