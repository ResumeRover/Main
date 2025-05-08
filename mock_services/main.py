from fastapi import FastAPI, Request, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
import os
import jwt
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import uvicorn

# Get environment variables
SERVICE_NAME = os.getenv("SERVICE_NAME", "mock_service")
PORT = int(os.getenv("PORT", "8000"))
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-for-development-only")

# Initialize FastAPI app
app = FastAPI(
    title=f"{SERVICE_NAME.replace('_', ' ').title()}",
    description=f"Mock {SERVICE_NAME} for Resume Parser microservices testing",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security setup
security = HTTPBearer()

# Mock database - in-memory for simplicity
users_db = {}
resumes_db = {}
jobs_db = {}
tokens_db = {}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": SERVICE_NAME}

# Request metadata endpoint
@app.get("/info")
async def get_info(request: Request):
    return {
        "service": SERVICE_NAME,
        "timestamp": datetime.utcnow().isoformat(),
        "request_headers": dict(request.headers),
        "client_host": request.client.host if request.client else None,
    }

# Mock Auth Service endpoints
if SERVICE_NAME == "auth_service":
    @app.post("/register")
    async def register(user_data: Dict[str, Any]):
        user_id = str(uuid.uuid4())
        users_db[user_id] = {
            "id": user_id,
            "email": user_data.get("email", f"user{user_id}@example.com"),
            "name": user_data.get("full_name", "Mock User"),
            "created_at": datetime.utcnow().isoformat()
        }
        return {"message": "User registered successfully", "user_id": user_id}

    @app.post("/login")
    async def login(login_data: Dict[str, Any]):
        # For mock, we'll accept any credentials
        email = login_data.get("username", "user@example.com")
        
        # Create a mock user if not exists
        user_id = str(uuid.uuid4())
        for uid, user in users_db.items():
            if user.get("email") == email:
                user_id = uid
                break
        else:
            users_db[user_id] = {
                "id": user_id,
                "email": email,
                "name": "Mock User",
                "created_at": datetime.utcnow().isoformat()
            }
        
        # Generate tokens
        access_token_expires = datetime.utcnow() + timedelta(minutes=30)
        access_token = jwt.encode(
            {
                "sub": user_id,
                "email": email,
                "roles": ["admin", "recruiter", "job_seeker"],
                "exp": access_token_expires
            },
            JWT_SECRET_KEY,
            algorithm="HS256"
        )
        
        refresh_token = str(uuid.uuid4())
        tokens_db[refresh_token] = {
            "user_id": user_id,
            "expires": (datetime.utcnow() + timedelta(days=7)).isoformat()
        }
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "refresh_token": refresh_token,
            "user": users_db[user_id]
        }
    
    @app.post("/refresh-token")
    async def refresh_token(token_data: Dict[str, Any]):
        refresh_token = token_data.get("refresh_token")
        if not refresh_token or refresh_token not in tokens_db:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        user_id = tokens_db[refresh_token]["user_id"]
        user = users_db.get(user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Generate new tokens
        access_token_expires = datetime.utcnow() + timedelta(minutes=30)
        access_token = jwt.encode(
            {
                "sub": user_id,
                "email": user.get("email"),
                "roles": ["admin", "recruiter", "job_seeker"],
                "exp": access_token_expires
            },
            JWT_SECRET_KEY,
            algorithm="HS256"
        )
        
        # Invalidate old refresh token and create new one
        del tokens_db[refresh_token]
        new_refresh_token = str(uuid.uuid4())
        tokens_db[new_refresh_token] = {
            "user_id": user_id,
            "expires": (datetime.utcnow() + timedelta(days=7)).isoformat()
        }
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "refresh_token": new_refresh_token
        }
    
    @app.get("/users/me")
    async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
        token = credentials.credentials
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("sub")
            
            if not user_id or user_id not in users_db:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid user ID"
                )
            
            return users_db[user_id]
        except jwt.PyJWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
    
    @app.post("/logout")
    async def logout(token_data: Dict[str, Any]):
        refresh_token = token_data.get("refresh_token")
        if refresh_token and refresh_token in tokens_db:
            del tokens_db[refresh_token]
        
        return {"message": "Logged out successfully"}

# Mock Upload Service endpoints
if SERVICE_NAME == "upload_service":
    @app.post("/upload")
    async def upload_resume(request: Request, credentials: HTTPAuthorizationCredentials = Depends(security)):
        token = credentials.credentials
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("sub")
            
            file_id = str(uuid.uuid4())
            status = "uploaded"
            
            # Store mock file metadata
            resumes_db[file_id] = {
                "file_id": file_id,
                "user_id": user_id,
                "original_filename": f"resume_{file_id}.pdf",
                "upload_date": datetime.utcnow().isoformat(),
                "status": status
            }
            
            return {
                "message": "Resume uploaded successfully",
                "file_id": file_id,
                "filename": f"resume_{file_id}.pdf",
                "status": status
            }
        except jwt.PyJWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
    
    @app.get("/status/{file_id}")
    async def get_upload_status(file_id: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
        token = credentials.credentials
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("sub")
            
            if file_id not in resumes_db:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="File not found"
                )
            
            resume = resumes_db[file_id]
            
            if resume["user_id"] != user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized to access this file"
                )
            
            # Simulate status changes
            statuses = ["uploaded", "processing", "parsed", "error"]
            current_idx = statuses.index(resume["status"])
            next_idx = (current_idx + 1) % len(statuses)
            resume["status"] = statuses[next_idx]
            
            return {
                "file_id": resume["file_id"],
                "filename": resume["original_filename"],
                "status": resume["status"],
                "upload_date": resume["upload_date"]
            }
        except jwt.PyJWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

# Mock Parser Service endpoints
if SERVICE_NAME == "parser_service":
    @app.post("/parse")
    async def parse_resume(request_data: Dict[str, Any], credentials: HTTPAuthorizationCredentials = Depends(security)):
        file_id = request_data.get("file_id")
        if not file_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File ID is required"
            )
        
        # For mock, we'll just return success
        return {"message": "Resume parsing started", "file_id": file_id}

# Mock Data Service endpoints
if SERVICE_NAME == "data_service":
    @app.get("/resumes")
    async def get_resumes(
        limit: int = 10, 
        skip: int = 0,
        credentials: HTTPAuthorizationCredentials = Depends(security)
    ):
        token = credentials.credentials
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("sub")
            
            # Filter resumes by user ID
            user_resumes = []
            for resume_id, resume in resumes_db.items():
                if resume.get("user_id") == user_id:
                    resume_copy = resume.copy()
                    resume_copy["id"] = resume_id
                    user_resumes.append(resume_copy)
            
            # Add mock data if none exists
            if not user_resumes:
                for i in range(5):
                    resume_id = str(uuid.uuid4())
                    resume = {
                        "id": resume_id,
                        "file_id": str(uuid.uuid4()),
                        "user_id": user_id,
                        "contact_info": {
                            "name": "John Doe",
                            "email": "john.doe@example.com",
                            "phone": "123-456-7890",
                            "location": "New York, NY"
                        },
                        "skills": ["Python", "FastAPI", "Docker", "MongoDB", "NLP"],
                        "education": [
                            {
                                "degree": "Bachelor of Science in Computer Science",
                                "institution": "University of Example",
                                "start_year": "2016",
                                "end_year": "2020"
                            }
                        ],
                        "experience": [
                            {
                                "title": "Software Engineer",
                                "company": "Tech Company Inc.",
                                "start_date": "Jan 2020",
                                "end_date": "Present",
                                "description": "Developed microservices architecture"
                            }
                        ],
                        "parsed_date": datetime.utcnow().isoformat()
                    }
                    user_resumes.append(resume)
            
            # Apply pagination
            paginated_resumes = user_resumes[skip:skip + limit]
            
            return {
                "total": len(user_resumes),
                "resumes": paginated_resumes,
                "limit": limit,
                "skip": skip
            }
        except jwt.PyJWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
    
    @app.get("/resumes/{resume_id}")
    async def get_resume(
        resume_id: str,
        credentials: HTTPAuthorizationCredentials = Depends(security)
    ):
        token = credentials.credentials
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("sub")
            
            # Check if resume exists in mock DB
            resume = resumes_db.get(resume_id)
            
            # Generate mock resume if not exists
            if not resume:
                resume = {
                    "id": resume_id,
                    "file_id": str(uuid.uuid4()),
                    "user_id": user_id,
                    "contact_info": {
                        "name": "John Doe",
                        "email": "john.doe@example.com",
                        "phone": "123-456-7890",
                        "location": "New York, NY"
                    },
                    "skills": ["Python", "FastAPI", "Docker", "MongoDB", "NLP"],
                    "education": [
                        {
                            "degree": "Bachelor of Science in Computer Science",
                            "institution": "University of Example",
                            "start_year": "2016",
                            "end_year": "2020"
                        }
                    ],
                    "experience": [
                        {
                            "title": "Software Engineer",
                            "company": "Tech Company Inc.",
                            "start_date": "Jan 2020",
                            "end_date": "Present",
                            "description": "Developed microservices architecture"
                        }
                    ],
                    "parsed_date": datetime.utcnow().isoformat()
                }
            
            # Check user authorization
            if resume.get("user_id") != user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized to access this resume"
                )
            
            return resume
        except jwt.PyJWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

# Mock Jobs Service endpoints
if SERVICE_NAME == "jobs_service":
    @app.get("/jobs")
    async def get_jobs(
        limit: int = 10, 
        skip: int = 0,
        title: Optional[str] = None,
        location: Optional[str] = None,
        credentials: HTTPAuthorizationCredentials = Depends(security)
    ):
        # Generate mock jobs
        mock_jobs = []
        for i in range(20):
            job_id = str(uuid.uuid4())
            job = {
                "id": job_id,
                "title": f"Senior Software Engineer {i+1}",
                "company": f"Tech Company {i+1}",
                "location": "Remote" if i % 3 == 0 else "New York, NY" if i % 3 == 1 else "San Francisco, CA",
                "description": "We are looking for an experienced software engineer...",
                "requirements": ["Python", "FastAPI", "Docker", "MongoDB", "NLP"],
                "preferred_skills": ["AWS", "Kubernetes", "React"],
                "salary_range": "$120,000 - $150,000",
                "job_type": "Full-time",
                "created_at": datetime.utcnow().isoformat(),
                "is_active": True
            }
            mock_jobs.append(job)
        
        # Filter by title if provided
        if title:
            mock_jobs = [job for job in mock_jobs if title.lower() in job["title"].lower()]
        
        # Filter by location if provided
        if location:
            mock_jobs = [job for job in mock_jobs if location.lower() in job["location"].lower()]
        
        # Apply pagination
        total = len(mock_jobs)
        paginated_jobs = mock_jobs[skip:skip + limit]
        
        return {
            "total": total,
            "jobs": paginated_jobs,
            "limit": limit,
            "skip": skip
        }
    
    @app.post("/jobs/match/{resume_id}")
    async def match_jobs(
        resume_id: str,
        credentials: HTTPAuthorizationCredentials = Depends(security)
    ):
        token = credentials.credentials
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
            
            # Generate mock matched jobs
            matched_jobs = []
            for i in range(5):
                job_id = str(uuid.uuid4())
                job = {
                    "id": job_id,
                    "title": f"Senior Software Engineer {i+1}",
                    "company": f"Tech Company {i+1}",
                    "location": "Remote" if i % 3 == 0 else "New York, NY" if i % 3 == 1 else "San Francisco, CA",
                    "description": "We are looking for an experienced software engineer...",
                    "requirements": ["Python", "FastAPI", "Docker", "MongoDB", "NLP"],
                    "preferred_skills": ["AWS", "Kubernetes", "React"],
                    "salary_range": "$120,000 - $150,000",
                    "job_type": "Full-time",
                    "created_at": datetime.utcnow().isoformat(),
                    "is_active": True,
                    "match_score": 90 - (i * 5),
                    "skill_match": 85 - (i * 3),
                    "text_similarity": 95 - (i * 7)
                }
                matched_jobs.append(job)
            
            return {
                "resume_id": resume_id,
                "matches": matched_jobs,
                "total_matches": len(matched_jobs)
            }
        except jwt.PyJWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

# Mock Search Service endpoints
if SERVICE_NAME == "search_service":
    @app.get("/search")
    async def search(
        query: str,
        entity_type: str,
        limit: int = 10,
        skip: int = 0,
        credentials: HTTPAuthorizationCredentials = Depends(security)
    ):
        token = credentials.credentials
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("sub")
            
            results = []
            if entity_type == "resumes":
                # Generate mock resume search results
                for i in range(7):
                    resume_id = str(uuid.uuid4())
                    result = {
                        "id": resume_id,
                        "file_id": str(uuid.uuid4()),
                        "user_id": user_id,
                        "contact_info": {
                            "name": f"Candidate {i+1}",
                            "email": f"candidate{i+1}@example.com"
                        },
                        "match_score": 90 - (i * 10),
                        "highlight": f"...experience with <mark>{query}</mark> and related technologies..."
                    }
                    results.append(result)
            elif entity_type == "jobs":
                # Generate mock job search results
                for i in range(5):
                    job_id = str(uuid.uuid4())
                    result = {
                        "id": job_id,
                        "title": f"Senior {query} Engineer",
                        "company": f"Tech Company {i+1}",
                        "location": "Remote" if i % 2 == 0 else "New York, NY",
                        "match_score": 95 - (i * 7),
                        "highlight": f"...seeking expert in <mark>{query}</mark> for our growing team..."
                    }
                    results.append(result)
            
            return {
                "query": query,
                "entity_type": entity_type,
                "total": len(results),
                "results": results[skip:skip + limit],
                "limit": limit,
                "skip": skip
            }
        except jwt.PyJWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

# Run the server
if __name__ == "__main__":
    print(f"Starting {SERVICE_NAME} on port {PORT}")
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)