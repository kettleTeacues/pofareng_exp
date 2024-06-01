# containers$ uvicorn backend.main:app --reload
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

import auth
from routers import hello, lifelog, log_memo, users, dashboard

load_dotenv()

app = FastAPI()
app.include_router(auth.router)
app.include_router(hello.router)
app.include_router(users.router)
app.include_router(lifelog.router)
app.include_router(log_memo.router)
app.include_router(dashboard.router)

# CORSの設定
hosts = os.getenv('CORS_ALLOWED_HOSTS', '').split(',')
origins = hosts

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
