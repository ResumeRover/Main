from fastapi import APIRouter, Request, Depends
from app.core.config import settings
from app.services.proxy import proxy_request
from app.middleware.auth import get_current_user, has_role

router = APIRouter(prefix="/resumes", tags=["Resumes"])

@router.post("/upload")
async def upload_resume(request: Request, user: dict = Depends(get_current_user)):
    """
    Upload a new resume
    """
    return await proxy_request(
        request=request,
        target_service_url=settings.UPLOAD_SERVICE_URL,
        path="/upload"
    )

@router.get("/")
async def get_resumes(request: Request, user: dict = Depends(get_current_user)):
    """
    Get all resumes for current user
    """
    return await proxy_request(
        request=request,
        target_service_url=settings.DATA_SERVICE_URL,
        path="/resumes"
    )

@router.get("/{resume_id}")
async def get_resume(resume_id: str, request: Request, user: dict = Depends(get_current_user)):
    """
    Get a specific resume by ID
    """
    return await proxy_request(
        request=request,
        target_service_url=settings.DATA_SERVICE_URL,
        path=f"/resumes/{resume_id}"
    )

@router.put("/{resume_id}")
async def update_resume(resume_id: str, request: Request, user: dict = Depends(get_current_user)):
    """
    Update a resume
    """
    return await proxy_request(
        request=request,
        target_service_url=settings.DATA_SERVICE_URL,
        path=f"/resumes/{resume_id}"
    )

@router.delete("/{resume_id}")
async def delete_resume(resume_id: str, request: Request, user: dict = Depends(get_current_user)):
    """
    Delete a resume
    """
    return await proxy_request(
        request=request,
        target_service_url=settings.DATA_SERVICE_URL,
        path=f"/resumes/{resume_id}"
    )

@router.get("/parse-status/{file_id}")
async def get_parsing_status(file_id: str, request: Request, user: dict = Depends(get_current_user)):
    """
    Get the parsing status of a resume
    """
    return await proxy_request(
        request=request,
        target_service_url=settings.UPLOAD_SERVICE_URL,
        path=f"/status/{file_id}"
    )