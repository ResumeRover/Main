from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
import logging

from app.core.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Initialize application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API Gateway for Resume Parser microservices",
    version=settings.VERSION,
    docs_url=f"{settings.API_PREFIX}/docs",
    redoc_url=f"{settings.API_PREFIX}/redoc",
    openapi_url=f"{settings.API_PREFIX}/openapi.json",
    debug=settings.DEBUG
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOW_ORIGINS,
    allow_credentials=settings.ALLOW_CREDENTIALS,
    allow_methods=settings.ALLOW_METHODS,
    allow_headers=settings.ALLOW_HEADERS,
)

# Create HTTP client for service communication
@app.on_event("startup")
async def startup_event():
    logger.info("Starting API Gateway")
    app.state.http_client = httpx.AsyncClient()

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down API Gateway")
    await app.state.http_client.aclose()

# Health check endpoint
@app.get(f"{settings.API_PREFIX}/health")
async def health_check():
    return {"status": "healthy", "service": "api_gateway"}

# Import and include routers
from app.routes.auth import router as auth_router
from app.routes.resumes import router as resumes_router
from app.routes.jobs import router as jobs_router

app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(resumes_router, prefix=settings.API_PREFIX)
app.include_router(jobs_router, prefix=settings.API_PREFIX)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=settings.DEBUG)