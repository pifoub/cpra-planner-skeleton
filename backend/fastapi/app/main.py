
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers.cpra import router as cpra_router

app = FastAPI(title="CPRA Planner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cpra_router, prefix="/api")
