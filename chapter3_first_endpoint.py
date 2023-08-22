from fastapi import FastAPI
app = FastAPI()
@app.get("/")
async def root():
 return {"message": "Hello FastAPI"}

@app.post("/")
async def post_root():
 return {"message": "Post requeSst success"}

@app.get("/car/{id}/")
async def root(id):
 return {"car_id":id}
