from fastapi import APIRouter, Request, Depends
from app.core.config import settings
from app.services.proxy import proxy_request
from app.middleware.auth import get_current_user, has_role

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.get("/")
async def get_jobs(request: Request, user: dict = Depends(get_current_user)):
    """
    Get all available jobs
    """
    return await proxy_request(
        request=request,
        target_service_url=settings.JOBS_SERVICE_URL,
        path="/jobs"
    )

@router.post("/")
async def create_job(
    request: Request, 
    user: dict = Depends(has_role(["admin", "recruiter"]))
):
    """
    Create a new job listing
    """
    return await proxy_request(
        request=request,
        target_service_url=settings.JOBS_SERVICE_URL,
        path="/jobs"
    )

@router.get("/{job_id}")
async def get_job(job_id: str, request: Request, user: dict = Depends(get_current_user)):
    """
    Get a specific job by ID
    """
    return await proxy_request(
        request=request,
        target_service_url=settings.JOBS_SERVICE_URL,
        path=f"/jobs/{job_id}"
    )

@router.put("/{job_id}")
async def update_job(
    job_id: str, 
    request: Request, 
    user: dict = Depends(has_role(["admin", "recruiter"]))
):
    """
    Update a job listing
    """
    return await proxy_request(
        request=request,
        target_service_url=settings.JOBS_SERVICE_URL,
        path=f"/jobs/{job_id}"
    )

@router.delete("/{job_id}")
async def delete_job(
    job_id: str, 
    request: Request, 
    user: dict = Depends(has_role(["admin", "recruiter"]))
):
    """
    Delete a job listing
    """
    return await proxy_request(
        request=request,
        target_service_url=settings.JOBS_SERVICE_URL,
        path=f"/jobs/{job_id}"
    )

@router.post("/match/{resume_id}")
async def match_jobs(resume_id: str, request: Request, user: dict = Depends(get_current_user)):
    """
    Match jobs with a specific resume
    """
    return await proxy_request(
        request=request,
        target_service_url=settings.JOBS_SERVICE_URL,
        path=f"/jobs/match/{resume_id}"
    )