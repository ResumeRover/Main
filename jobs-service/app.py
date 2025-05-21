import azure.functions as func
import os
import json
from datetime import datetime
from typing import List, Optional, Dict, Any, Union
import requests
import logging
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from bson import ObjectId
import os

# MongoDB connection
MONGODB_URI = os.environ.get("MONGODB_URI")
client = AsyncIOMotorClient(MONGODB_URI, tlsCAFile=certifi.where())
verification_endpoint = os.environ.get("VERIFICATION_URL", "https://9b15-2407-c00-5002-4731-8141-a1b-d415-e2a1.ngrok-free.app/")
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

'''
async def verify_credentials(parsed_resume_data, job_id):
    """
    Verify credentials by checking against blockchain and university/company records.
    Returns the verified resume data with verification status.
    """
    is_verified = True
    verification_details = []
    
    try:
        # Extract data from parsed resume
        name = parsed_resume_data.get("name", "")
        education = parsed_resume_data.get("education", [])
        work_experience = parsed_resume_data.get("work_experience", [])
        
        # Verify education (degree)
        for edu in education:
            degree = edu.get("degree", "")
            institution = edu.get("institution", "")
            
            if degree and institution:
                try:
                    degree_payload = {
                        "name": name,
                        "university": institution,
                        "degree": degree
                    }
                    
                    degree_response = requests.post(
                        f"{verification_endpoint}/verification/degree",
                        json=degree_payload,
                        timeout=10
                    )
                    
                    if degree_response.status_code == 200:
                        result = degree_response.json()
                        if not result.get("is_verified", False):
                            is_verified = False
                            verification_details.append(f"Degree verification failed: {degree} from {institution}")
                    else:
                        is_verified = False
                        verification_details.append(f"Degree verification service error: {degree_response.status_code}")
                        
                except Exception as e:
                    logging.error(f"Degree verification error: {str(e)}")
                    is_verified = False
                    verification_details.append(f"Degree verification error: {str(e)}")
        
        # Verify GPA if available
        # Assuming GPA might be extracted from education data or directly in the resume
        gpa_data = None
        for edu in education:
            if "GPA" in edu.get("degree", "") or "GPA" in edu.get("description", ""):
                # Extract GPA value using regex or other methods
                # For now, we'll use a placeholder
                gpa_data = {
                    "name": name,
                    "university": edu.get("institution", ""),
                    "gpa": 3.5  # This should be extracted from the resume
                }
                break
        
        if gpa_data:
            try:
                gpa_response = requests.post(
                    f"{verification_endpoint}/verification/gpa",
                    json=gpa_data,
                    timeout=10
                )
                
                if gpa_response.status_code == 200:
                    result = gpa_response.json()
                    if not result.get("is_verified", False):
                        is_verified = False
                        verification_details.append(f"GPA verification failed for {gpa_data['university']}")
                else:
                    is_verified = False
                    verification_details.append(f"GPA verification service error: {gpa_response.status_code}")
                    
            except Exception as e:
                logging.error(f"GPA verification error: {str(e)}")
                is_verified = False
                verification_details.append(f"GPA verification error: {str(e)}")
        
        # Verify employment history
        for job in work_experience:
            job_title = job.get("position", "")
            company = job.get("company", "")
            
            if job_title and company:
                try:
                    employment_payload = {
                        "name": name,
                        "company": company,
                        "job_title": job_title
                    }
                    
                    employment_response = requests.post(
                        f"{verification_endpoint}/verification/employment",
                        json=employment_payload,
                        timeout=10
                    )
                    
                    if employment_response.status_code == 200:
                        result = employment_response.json()
                        if not result.get("is_verified", False):
                            is_verified = False
                            verification_details.append(f"Employment verification failed: {job_title} at {company}")
                    else:
                        is_verified = False
                        verification_details.append(f"Employment verification service error: {employment_response.status_code}")
                        
                except Exception as e:
                    logging.error(f"Employment verification error: {str(e)}")
                    is_verified = False
                    verification_details.append(f"Employment verification error: {str(e)}")
        
        # Update the resume data with verification status
        parsed_resume_data["is_verified"] = is_verified
        parsed_resume_data["verification_details"] = verification_details
        
        # Set status based on verification
        if is_verified:
            parsed_resume_data["status"] = "passed"
        else:
            parsed_resume_data["status"] = "failed_verification"
            
        return parsed_resume_data
        
    except Exception as e:
        logging.error(f"Verification process error: {str(e)}")
        parsed_resume_data["is_verified"] = False
        parsed_resume_data["verification_details"] = [f"Verification process error: {str(e)}"]
        parsed_resume_data["status"] = "verification_error"
        return parsed_resume_data
'''
        
async def apply_for_job_impl(req: func.HttpRequest, job_id: str) -> func.HttpResponse:
    """
    Process job application with resume verification against blockchain.
    """   
    try:
        # Get the file content directly from the request
        file_content = req.get_body()
        
        # Send the resume to the parser endpoint
        parser_url = "https://resume-parser-143155629435.asia-southeast1.run.app/"
        
        # Prepare the files and data for the request
        files = {
            'file': ('resume.pdf', file_content, 'application/pdf')
        }
        
        data = {
            'job_id': job_id
        }

        # Send request to the parser
        response = requests.post(parser_url, files=files, data=data)
        
        if response.status_code != 200:
            return func.HttpResponse(
                response.text,
                mimetype="application/json",
                status_code=response.status_code
            )
        
        # Parse the response to get the resume_id
        parsed_result = json.loads(response.text)
        resume_id = parsed_result.get("resume_id")
        
        if not resume_id:
            return func.HttpResponse(
                json.dumps({"error": "Resume ID not found in parser response"}),
                mimetype="application/json",
                status_code=500
            )
        
        # Retrieve the parsed resume from the database
        resume_object_id = ObjectId(resume_id)
        parsed_resume = await applications_collection.find_one({"_id": resume_object_id})
        
        if not parsed_resume:
            return func.HttpResponse(
                json.dumps({"error": f"Parsed resume with ID {resume_id} not found"}),
                mimetype="application/json",
                status_code=404
            )
        
        # Convert ObjectId to string for JSON serialization
        parsed_resume["_id"] = str(parsed_resume["_id"])
        
        # Send resume to verification API
        verification_url = os.environ.get("VERIFICATION_API_URL")
        if not verification_url:
            return func.HttpResponse(
                json.dumps({"error": "Verification API URL not configured"}),
                mimetype="application/json",
                status_code=500
            )

        verification_response = requests.post(
            verification_url,
            json={"resume_id": resume_id}
        )

        '''
        # Verify credentials against blockchain and university/company records
        verified_resume = await verify_credentials(parsed_resume, job_id)
        
        # Update the resume in the database with verification results
        update_result = await applications_collection.update_one(
            {"_id": resume_object_id},
            {"$set": {
                "is_verified": verified_resume["is_verified"],
                "verification_details": verified_resume.get("verification_details", []),
                "status": verified_resume["status"]
            }}
        )
        
        # Return the response with verification status
        return func.HttpResponse(
            json.dumps({
                "success": True,
                "message": "Resume processed and verified",
                "resume_id": resume_id,
                "verification_status": {
                    "is_verified": verified_resume["is_verified"],
                    "details": verified_resume.get("verification_details", []),
                    "status": verified_resume["status"]
                }
            }),
            mimetype="application/json",
            status_code=200
        )
        
    except Exception as e:
        logging.error(f"Error in apply_for_job_impl: {str(e)}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )
        '''

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