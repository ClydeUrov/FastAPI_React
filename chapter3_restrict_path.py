# from enum import Enum
# from typing import Dict
#
# from fastapi import FastAPI, Path, Body
#
# app = FastAPI()
#
#
# class AccountType(str, Enum):
#     FREE = "free"
#     PRO = "pro"
#
#
# @app.get("/account/{type}/{months}")
# async def account(acc_type: AccountType, months: int = Path(..., ge=3, le=12)):
#     return {
#         "message": "Account created",
#         "account_type": acc_type,
#         "months": months
#     }
#
# @app.get("/cars/price")
# async def cars_by_price(min_price: int = 0, max_price: int=100000):
#     return{"Message":f"Listing cars with prices between {min_price} and {max_price}"}
#
# @app.post("/cars")
# async def new_car(data: Dict = Body(...)):
#     print(data)
#     return {
#         "message": data
#     }
import shutil

from fastapi import FastAPI, Form, File, UploadFile
app = FastAPI()


@app.post("/upload/")
async def upload(picture: UploadFile = File(...), brand: str = Form(...), model: str = Form(...)):
    with open("saved_file.png", "wb") as buffer:
        shutil.copyfileobj(picture.file, buffer)
    return {
        "brand": brand,
        "model": model,
        "file_name": picture.filename
    }
