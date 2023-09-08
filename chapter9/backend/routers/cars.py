from math import ceil
from typing import Optional, List
from chapter9.backend.models import CarBase
from fastapi_cache.decorator import cache
from fastapi import APIRouter, Request, Body, HTTPException, BackgroundTasks
from chapter9.backend.utils.report import report_pipeline

router = APIRouter()


@router.get("/all", response_description="List all cars")
async def list_all_cars(
        request: Request,
        min_price: int = 0,
        max_price: int = 100000,
        brand: Optional[str] = None,
        page: int = 1,
) -> dict[str, List[CarBase] | int]:
    RESULTS_PER_PAGE = 24
    skip = (page - 1) * RESULTS_PER_PAGE
    query = {"price": {"$lt": max_price, "$gt": min_price}}
    if brand:
        query["brand"] = brand
    pages = ceil(
        await request.app.mongodb["cars1"].count_documents(query) / RESULTS_PER_PAGE
    )
    full_query = (
        request.app.mongodb['cars1']
        .find(query)
        .sort("km", -1)
        .skip(skip)
        .limit(RESULTS_PER_PAGE)
    )

    results = [CarBase(**raw_car) async for raw_car in full_query]
    return {"results": results, "pages": pages}


@router.get("/simple/{n}", response_description="Sample of N cars")
@cache(expire=60)
async def get_simple(n: int, request: Request):
    query = [
        {"$match": {"year": {"$gt": 2010}}},
        {"$project": {"_id": 0}},
        {"$sample": {"size": n}},
        {"$sort": {"brand": 1, "make": 1, "year": 1}},
    ]

    full_query = request.app.mongodb["cars"].aggregate(query)
    return [el async for el in full_query]


@router.get("/brand/{val}/{brand}", response_description="Get brand models by val")
async def brand_price(brand: str, val: str, request: Request):
    query = [
        {"$match": {"brand": brand}},
        {"$project": {"_id": 0}},
        {
            "$group": {"_id": {"model": "$make"}, f"avg_{val}": {"$avg": f"${val}"}},
        },
        {"$sort": {f"avg_{val}": 1}},
    ]

    full_query = request.app.mongodb["cars"].aggregate(query)
    return [el async for el in full_query]


# count cars by brand
@router.get("/brand/count", response_description="Count by brand")
async def brand_count(request: Request):

    query = [{"$group": {"_id": "$brand", "count": {"$sum": 1}}}]

    full_query = request.app.mongodb["cars"].aggregate(query)
    return [el async for el in full_query]


# count cars by make
@router.get("/make/count/{brand}", response_description="Count by brand")
async def brand_count(brand: str, request: Request):

    query = [
        {"$match": {"brand": brand}},
        {"$group": {"_id": "$make", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]

    full_query = request.app.mongodb["cars"].aggregate(query)
    return [el async for el in full_query]


@router.post("/email", response_description="Send email")
async def send_mail(
    background_tasks: BackgroundTasks,
    cars_num: int = Body(...),
    email: str = Body(...),
):

    background_tasks.add_task(report_pipeline, email, cars_num)

    return {"Received": {"email": email, "cars_num": cars_num}}
