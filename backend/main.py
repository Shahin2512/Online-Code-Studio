from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import requests

app = FastAPI()

# CORS (you can restrict origins later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the built React frontend
app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")

@app.post("/execute")
async def execute_code(request: Request):
    data = await request.json()
    language = data.get("language")
    code = data.get("code")

    payload = {
        "language": language,
        "version": "*",
        "files": [
            {"name": f"main.{language}", "content": code}
        ]
    }

    response = requests.post("https://emkc.org/api/v2/piston/execute", json=payload)
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Execution failed", "details": response.text}
