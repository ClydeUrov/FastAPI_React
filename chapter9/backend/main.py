from decouple import config
from fastapi import FastAPI

import aioredis
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend

from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware

from motor.motor_asyncio import AsyncIOMotorClient
from chapter9.backend.routers.cars import router as cars_router

DB_URL = config('DB_URL', cast=str)
DB_NAME = config('DB_NAME', cast=str)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cars_router, prefix="/cars", tags=["cars"])

@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(DB_URL)
    app.mongodb = app.mongodb_client[DB_NAME]

    app.redis = await aioredis.create_redis_pool("redis://localhost:6379", encoding="utf8")
    FastAPICache.init(RedisBackend(app.redis), prefix="fastapi-cache")


@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()
