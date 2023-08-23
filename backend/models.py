from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)
    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")


class MongoBaseModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        json_encoders = {ObjectId: str}
        arbitrary_types_allowed = True


class CarBase(MongoBaseModel):
    brand: str = Field(..., min_length=1)
    make: str = Field(..., min_length=1)
    year: int = Field(..., gt=1975, lt=2023)
    price: int = Field(...)
    km: int = Field(...)
    cm3: int = Field(...)


class CarUpdate(MongoBaseModel):
    price: Optional[int] = None


class CarDB(CarBase):
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
