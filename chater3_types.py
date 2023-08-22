def annotated_function(name: str, age: int) -> str:
    return f"Your name is {name.upper()} and you are {age} years old!"


print(annotated_function(name="marko", age=99))

from enum import Enum
from typing import List
from pydantic import BaseModel, ValidationError


class Fuel(str, Enum):
    PETROL = 'PETROL'
    DIESEL = 'DIESEL'
    LPG = 'LPG'


class Car(BaseModel):
    brand: str
    model: str
    year: int
    fuel: Fuel
    countries: List[str]
    note: str = "No note"


car = Car(
    brand="Lancia",
    model="Musa",
    fuel="PETROL",
    year="2006",
    countries=["Italy", "France"]
)
print(car.model_dump_json())

try:
    invalid_car = Car(
        brand="Lancia",
        fuel="PETROL",
        year="something",
        countries=["Italy","France"]
    )
    print(invalid_car.model_dump_json())
except ValidationError as e:
    print(e)


