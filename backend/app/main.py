from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import Base, engine
from .routes import auth, dashboard, interview, resume

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="InterviewAI API",
    description="Backend API for the InterviewAI platform",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(interview.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {
        "message": "InterviewAI Backend is running"
    }