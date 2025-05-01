"""
FastAPI main application for Blockchain-Based Applicant Verification.
"""
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .routes import verification

# Load environment variables
load_dotenv()

# Define application
app = FastAPI(
    title="Blockchain-Based Applicant Verification API",
    description="API for verifying resume information using blockchain and oracle simulations",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - in production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(verification.router)

@app.get("/")
async def root():
    """API root - returns basic information."""
    return {
        "message": "Blockchain-Based Applicant Verification API",
        "version": "1.0.0",
        "endpoints": {
            "verification": "/verification",
            "documentation": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}