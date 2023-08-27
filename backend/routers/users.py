from fastapi import APIRouter, Request, Body, status, HTTPException, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from backend.models import UserBase, LoginBase, CurrentUser
from backend.authentication import AuthHandler

router = APIRouter()
auth_handler = AuthHandler()


@router.post("/register", response_description="Register user")
async def register(request: Request, newUser: UserBase = Body(...)) -> JSONResponse:
    newUser.password = auth_handler.get_password_hash(newUser.password)
    newUser = jsonable_encoder(newUser)

    if (
        existing_email := await request.app.mongodb["users"].find_one({"email": newUser["email"]})
    ) is not None:
        raise HTTPException(
            status_code=409, detail=f"User with email {newUser['email']} already exists"
        )
    if (
        existing_username := await request.app.mongodb["users"].find_one(
            {"username": newUser["username"]}
        )
    ) is not None:
        raise HTTPException(
            status_code=409, detail=f"User with username {newUser['username']} already exists"
        )

    user = await request.app.mongodb["users"].insert_one(newUser)
    created_user = await request.app.mongodb["users"].find_one({"_id": user.inserted_id})

    # return UserBase(**created_user)
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_user)


@router.post('/login', response_description="Login user")
async def login(request: Request, loginUser: LoginBase = Body(...)):
    user = await request.app.mongodb["users"].find_one({"email": loginUser.email})

    if (user is None) or (
        not auth_handler.verify_password(loginUser.password, user["password"])
    ):
        raise HTTPException(status_code=401, detail="Invalid email and/or password")
    token = auth_handler.encoder_token(user["_id"])

    return JSONResponse(content={"token": token})


@router.get('/me', response_description="Logged in user data")
async def me(request: Request, userId = Depends(auth_handler.auth_wrapper)):

    current_user = await request.app.mongodb["users"].find_one({"_id": userId})
    result = CurrentUser(**current_user).model_dump()
    result["id"] = userId
    return JSONResponse(status_code=status.HTTP_200_OK, content=result)
