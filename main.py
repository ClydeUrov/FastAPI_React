from fastapi import FastAPI
from decouple import config

app = FastAPI()
DB_URL = config('DB_URL', cast=str)
DB_NAME = config('DB_NAME', cast=str)


@app.get("/")
async def root():
    return {"message": "Hello World"}
