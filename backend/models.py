from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, EmailStr, field_validator
from email_validator import validate_email, EmailNotValidError
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
    cm3: int = Field(..., gt=600, lt=8000)


class CarUpdate(MongoBaseModel):
    price: Optional[int] = None


class CarDB(CarBase):
    owner: str = Field(...)


class Role(str, Enum):
    SALESPERSON = "SALESPERSON"
    ADMIN = "ADMIN"


class UserBase(MongoBaseModel):
    username: str = Field(..., min_length=3, max_length=15)
    email: str = Field(...)
    password: str = Field(...)
    role: Role

    @field_validator("email")
    def valid_email(cls, v):
        try:
            email = validate_email(v).email
            return email
        except EmailNotValidError as e:
            raise e


class LoginBase(BaseModel):
    email: str = EmailStr
    password: str = Field(...)


class CurrentUser(BaseModel):
    email: str = EmailStr
    username: str = Field(...)
    role: str = Field(...)
