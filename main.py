from fastapi import FastAPI
from decouple import config
from motor.motor_asyncio import AsyncIOMotorClient
from backend.routers.cars import router as cars_router
import uvicorn
from fastapi.middleware.cors import CORSMiddleware


origins = ["*"]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_URL = config('DB_URL', cast=str)
DB_NAME = config('DB_NAME', cast=str)


@app.on_event("startup")
async def startup_bd_client():
    app.mongodb_client = AsyncIOMotorClient(DB_URL)
    app.mongodb = app.mongodb_clint[DB_NAME]

@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()

@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(cars_router, prefix="/cars", tags=["cars"])


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        reload=True
    )