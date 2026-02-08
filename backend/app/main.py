from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import warnings
import pandas as pd

# Suppress persistent pandas/numpy runtime warnings for cleaner logs
warnings.filterwarnings("ignore", category=RuntimeWarning)
warnings.filterwarnings("ignore", message=".*invalid value encountered in subtract.*")

app = FastAPI(title="Intelligent Trading Assistant", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Intelligent Trading Assistant API"}

from app.api.endpoints import router
app.include_router(router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "healthy"}
