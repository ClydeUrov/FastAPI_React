from typing import List, Optional

from bson import ObjectId
from fastapi import APIRouter, HTTPException, Request, Body, status, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse, Response

from backend.models import CarDB, CarUpdate, CarBase, PyObjectId
from backend.routers.users import auth_handler

router = APIRouter()


@router.post("/", response_description="Add new car")
async def create_car(
        request: Request,
        car: CarBase = Body(...),
        userId = Depends(auth_handler.auth_wrapper)
):
    car = jsonable_encoder(car)
    car["owner"] = userId

    new_car = await request.app.mongodb['cars2'].insert_one(car)
    created_car = await request.app.mongodb['cars2'].find_one({"_id": new_car.inserted_id})

    # Преобразование _id в ожидаемую структуру
    created_car["_id"] = str(created_car["_id"])

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_car)


@router.get("/{id}", response_description="Get a single car")
async def show_car(id: str, request: Request):
    car = await request.app.mongodb["cars1"].find_one({"_id": ObjectId(id)})
    print(car)
    if car is not None:
        return CarBase(**car)
    raise HTTPException(status_code=404, detail=f"Car with id {id} not found")


@router.get("/my", response_description="Get a single car")
async def show_car(id: str, request: Request):
    car = await request.app.mongodb["cars2"].find_one({"_id": id})
    if car is not None:
        return CarDB(**{**car, '_id': PyObjectId(car['_id'])})
    raise HTTPException(status_code=404, detail=f"Car with id {id} not found")


@router.get("/", response_description="List all cars")
async def list_all_cars(
    request: Request,
    min_price: int = 0,
    max_price: int = 100000,
    brand: Optional[str] = None,
    page: int = 1,
    userId = Depends(auth_handler.auth_wrapper)
) -> List[CarBase]:
    RESULTS_PER_PAGE = 24
    skip = (page - 1) * RESULTS_PER_PAGE
    query = {"price": {"$lt": max_price, "$gt": min_price}}
    if brand:
        query["brand"] = brand
    full_query = request.app.mongodb['cars1'].find(query).sort("_id", -1).skip(skip).limit(
        RESULTS_PER_PAGE)
    results = [CarBase(**raw_car) async for raw_car in full_query]
    return results


@router.patch("/{id}", response_description="Update car")
async def update_task(
        id: str,
        request: Request,
        car: CarUpdate = Body(...),
        userId = Depends(auth_handler.auth_wrapper)
):
    # check if the user trying to modify is an admin:
    user = await request.app.mongodb["users"].find_one({"_id": userId})
    # check if the car is owned by the user trying to modify it
    find_car = await request.app.mongodb["cars2"].find_one({"_id": id})

    if find_car["owner"] != userId and user["role"] != "ADMIN":
        raise HTTPException(
            status_code=401, detail="Only the owner or an admin can update the car"
        )

    await request.app.mongodb['cars1'].update_one(
        {"_id": id}, {"$set": car.model_dump(exclude_unset=True)}
    )

    if car := await request.app.mongodb["cars2"].find_one({"_id": id}) is not None:
        return CarDB(**car)

    raise HTTPException(status_code=404, detail=f"Car with {id} not found")


@router.delete("/{id}", response_description="Delete car")
async def delete_task(id: str, request: Request, userId = Depends(auth_handler.auth_wrapper)):
    # check if the car is owned by the user trying to delete it
    car = await request.app.mongodb["cars2"].find_one({"_id": id})

    if not car:
        raise HTTPException(status_code=404, detail=f"Car with {id} not found")
    elif car["owner"] != userId:
        raise HTTPException(status_code=401, detail="Only the owner can delete the car")
    delete_result = await request.app.mongodb["cars2"].delete_one({"_id": id})

    if delete_result.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/brand/{brand}", response_description="Get brand overview")
async def brand_price(brand: str, request: Request):
    query = [
        {"$match": {"brand": brand}},
        {"$project": {"_id": 0, "price": 1, "year": 1, "make": 1}},
        {"$group": {"_id": {"model": "$make"}, "avgPrice": {"$avg": "$price"}},},
        {"$sort": {"avgPrice": 1}},
    ]
    full_query = request.app.mongodb["cars1"].aggregate(query)
    results = [el async for el in full_query]
    return results
