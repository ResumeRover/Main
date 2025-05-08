from fastapi import APIRouter, Request, Depends, HTTPException
from app.core.config import settings
from app.services.proxy import proxy_request
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
async def register(request: Request):
    """
    Register a new user
    """
    return await proxy_request(
        request=request,
        target_service_url=settings.AUTH_SERVICE_URL,
        path="/register"
    )

@router.post("/login")
async def login(request: Request):
    """
    Login a user and get access token
    """
    return await proxy_request(
        request=request,
        target_service_url=settings.AUTH_SERVICE_URL,
        path="/login"
    )

@router.post("/refresh-token")
async def refresh_token(request: Request):
    """
    Refresh an expired access token
    """
    return await proxy_request(
        request=request,
        target_service_url=settings.AUTH_SERVICE_URL,
        path="/refresh-token"
    )

@router.get("/me")
async def get_current_user_info(request: Request, user: dict = Depends(get_current_user)):
    """
    Get current user information
    """
    return await proxy_request(
        request=request,
        target_service_url=settings.AUTH_SERVICE_URL,
        path="/users/me"
    )

@router.post("/logout")
async def logout(request: Request, user: dict = Depends(get_current_user)):
    """
    Logout current user
    """
    return await proxy_request(
        request=request,
        target_service_url=settings.AUTH_SERVICE_URL,
        path="/logout"
    )