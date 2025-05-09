import azure.functions as func
import os
import json
from datetime import datetime
from typing import List, Optional, Dict, Any, Union

from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from bson import ObjectId

# MongoDB connection
MONGODB_URI = os.environ.get("MONGODB_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URI)
db = client.resume_rover_db
jobs_collection = db.jobs
applications_collection = db.parsed_resumes

# Models
class JobBase(BaseModel):
    title: str
    company: str
    location: str
    description: str
    required_skills: List[str]
    required_experience: int
    required_education: str
    salary_range: Optional[str] = None
    job_type: str  # Full-time, Part-time, Contract, etc.
    remote: bool = False

class Job(JobBase):
    id: str
    posted_by: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_active: bool = True
    
    class Config:
        orm_mode = True

class ApplicationBase(BaseModel):
    job_id: str
    user_id: str
    resume_id: str
    cover_letter: Optional[str] = None

class Application(ApplicationBase):
    id: str
    status: str = "pending"  # pending, reviewed, accepted, rejected
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

# Implementation functions
async def create_job_impl(job_data: Dict[str, Any]) -> func.HttpResponse:
    # Add creation timestamp
    job_data["created_at"] = datetime.utcnow().isoformat()
    job_data["is_active"] = True
    
    result = await jobs_collection.insert_one(job_data)
    
    # Get created job
    created_job = await jobs_collection.find_one({"_id": result.inserted_id})
    created_job["id"] = str(created_job.pop("_id"))
    
    return func.HttpResponse(
        json.dumps(created_job),
        mimetype="application/json"
    )

async def list_jobs_impl(
    active: bool = True,
    location: Optional[str] = None,
    job_type: Optional[str] = None,
    remote: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 10
) -> func.HttpResponse:
    # Build query filter
    query_filter = {"is_active": active}
    
    if location:
        query_filter["location"] = {"$regex": location, "$options": "i"}
    
    if job_type:
        query_filter["job_type"] = job_type
    
    if remote:
        query_filter["remote"] = remote.lower() == "true"
    
    if search:
        # Search in title, company, and description
        query_filter["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"company": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    # Execute query
    cursor = jobs_collection.find(query_filter).skip(skip).limit(limit).sort("created_at", -1)
    jobs = await cursor.to_list(length=limit)
    
    # Format jobs for response
    result = []
    for job in jobs:
        job["id"] = str(job.pop("_id"))
        result.append(job)
    
    return func.HttpResponse(
        json.dumps(result),
        mimetype="application/json"
    )

async def get_job_impl(job_id: str) -> func.HttpResponse:
    try:
        object_id = ObjectId(job_id)
    except:
        return func.HttpResponse(
            json.dumps({"error": "Invalid job ID format"}),
            mimetype="application/json",
            status_code=400
        )
    
    job = await jobs_collection.find_one({"_id": object_id})
    if not job:
        return func.HttpResponse(
            json.dumps({"error": "Job not found"}),
            mimetype="application/json",
            status_code=404
        )
    
    job["id"] = str(job.pop("_id"))
    return func.HttpResponse(
        json.dumps(job),
        mimetype="application/json"
    )

async def apply_for_job_impl(job_id: str, application_data: Dict[str, Any]) -> func.HttpResponse:
    # Validate job ID
    try:
        job_object_id = ObjectId(job_id)
    except:
        return func.HttpResponse(
            json.dumps({"error": "Invalid job ID format"}),
            mimetype="application/json",
            status_code=400
        )
    
    # Check if job exists and is active
    job = await jobs_collection.find_one({"_id": job_object_id, "is_active": True})
    if not job:
        return func.HttpResponse(
            json.dumps({"error": "Job not found or is inactive"}),
            mimetype="application/json",
            status_code=404
        )
    
    # # Check if user already applied
    # existing_application = await applications_collection.find_one({
    #     "job_id": job_id,
    #     "user_id": application_data.get("user_id")
    # })
    
    # if existing_application:
    #     return func.HttpResponse(
    #         json.dumps({"error": "You have already applied for this job"}),
    #         mimetype="application/json",
    #         status_code=400
    #     )
    
    # Create application
    application_data.update({
        "job_id": job_id,
        "status": "saved",
        "created_at": datetime.utcnow().isoformat()
    })
    
    result = await applications_collection.insert_one(application_data)
    
    # Get created application
    created_application = await applications_collection.find_one({"_id": result.inserted_id})
    created_application["id"] = str(created_application.pop("_id"))
    
    return func.HttpResponse(
        json.dumps(created_application),
        mimetype="application/json"
    )

async def get_user_applications_impl(user_id: str) -> func.HttpResponse:
    # Get all applications for the user
    applications = await applications_collection.find({"user_id": user_id}).to_list(length=100)
    result = []
    
    for app in applications:
        app["id"] = str(app.pop("_id"))
        
        # Get job details
        job = await jobs_collection.find_one({"_id": ObjectId(app["job_id"])})
        if job:
            job["id"] = str(job.pop("_id"))
            
            # Combine application and job details
            result.append({
                "application": app,
                "job": job
            })
    
    return func.HttpResponse(
        json.dumps(result),
        mimetype="application/json"
    )

async def health_check_impl() -> func.HttpResponse:
    return func.HttpResponse(
        json.dumps({
            "status": "healthy", 
            "service": "jobs-service", 
            "timestamp": datetime.utcnow().isoformat()
        }),
        mimetype="application/json"
    )