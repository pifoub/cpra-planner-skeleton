
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers.cpra import router as cpra_router

# Include an explicit API version so generated OpenAPI specs are stable
app = FastAPI(title="CPRA Planner API", version="0.0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cpra_router, prefix="/api")
