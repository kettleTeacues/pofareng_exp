# uvicorn main:app --reload
from fastapi import FastAPI

from routers import hello
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(hello.router)

# CORSの設定
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {'status': 'OK'}