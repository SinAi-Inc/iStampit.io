"""Simple test version of the API"""
from fastapi import FastAPI

app = FastAPI(title="iStampit API Test")

@app.get("/healthz")
async def health_check():
    return {"status": "ok", "message": "API is running"}

@app.get("/")
async def root():
    return {"message": "iStampit API Test"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
