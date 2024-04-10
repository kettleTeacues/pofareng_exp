# containers$ uvicorn backend.main:app --reload
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import auth
from routers import hello, lifelog, log_memo, users

app = FastAPI()
app.include_router(auth.router)
app.include_router(hello.router)
app.include_router(users.router)
app.include_router(lifelog.router)
app.include_router(log_memo.router)

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