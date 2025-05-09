import os
import json
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import logging
import requests

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.encoders import jsonable_encoder
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from fastapi import HTTPException, status

# MongoDB connection
MONGODB_URI = os.environ.get("MONGODB_URI", "")
client = AsyncIOMotorClient(MONGODB_URI)
db = client.resume_rover_db
users_collection = db.users

# Service URLs and keys
RESUME_SERVICE_URL = os.environ.get("RESUME_SERVICE_URL")
RESUME_SERVICE_KEY = os.environ.get("RESUME_SERVICE_KEY")
JOBS_SERVICE_URL = os.environ.get("JOBS_SERVICE_URL")
JOBS_SERVICE_KEY = os.environ.get("JOBS_SERVICE_KEY")

# JWT configuration
SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key-for-development")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Security utilities
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

# User Models
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str
    is_admin: bool = False  # Default is non-admin user

class UserInDB(UserBase):
    id: str = None
    is_admin: bool
    hashed_password: str
    created_at: datetime = None
    
    class Config:
        orm_mode = True

class User(UserBase):
    id: str
    is_admin: bool
    created_at: datetime
    
    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    is_admin: Optional[bool] = False

# Resume models for public submissions
class ResumeSubmission(BaseModel):
    job_id: str
    applicant_name: str
    email: EmailStr
    phone: Optional[str] = None
    cover_letter: Optional[str] = None
    resume_data: Dict[str, Any]

# Helper functions for authentication
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def get_user(username: str):
    user_dict = await users_collection.find_one({"username": username})
    if user_dict:
        # Convert ObjectId to string
        user_dict["id"] = str(user_dict.pop("_id"))
        return UserInDB(**user_dict)
    return None

async def authenticate_user(username: str, password: str):
    user = await get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username, is_admin=payload.get("is_admin", False))
    except JWTError:
        raise credentials_exception
    user = await get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

# async def get_current_active_user(current_user: UserInDB):
#     if current_user.disabled:
#         raise HTTPException(status_code=400, detail="Inactive user")
#     return current_user

# Admin access control
async def check_admin_access(token: str):
    """Check if user has admin privileges"""
    user = await get_current_user(token)
    # current_user = await get_current_active_user(user)
    
    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required for this operation"
        )
    return user.is_admin

# Auth functions
async def login_for_access_token(form_data: OAuth2PasswordRequestForm):
    """Process login and generate token"""
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "is_admin": user.is_admin},
        expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

async def register_user(user: UserCreate, token: str):
    """Register a new user (admin only)"""    
    # Check if user has admin privileges
    is_admin = await check_admin_access(token)
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required for this operation"
        )
    # Check if user exists
    existing_user = await users_collection.find_one({
        "$or": [
            {"username": user.username},
            {"email": user.email}
        ]
    })
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    # Create new user
    user_dict = user.dict()
    user_dict["hashed_password"] = get_password_hash(user.password)
    user_dict["created_at"] = datetime.utcnow()
    del user_dict["password"]  # Don't store plain password
    
    result = await users_collection.insert_one(user_dict)
    
    # Return user
    created_user = await users_collection.find_one({"_id": result.inserted_id})
    created_user["id"] = str(created_user.pop("_id"))
    
    user_response = User(**created_user)
    return jsonable_encoder(user_response)

# Gateway functions
async def forward_to_service(
    service_type: str, 
    path: str, 
    method: str, 
    headers: Dict, 
    data: Any = None, 
    params: Dict = None,
    token: Optional[str] = None
):
    """Generic function to forward requests to microservices"""
    if service_type == "resume":
        service_url = RESUME_SERVICE_URL
        service_key = RESUME_SERVICE_KEY
    elif service_type == "jobs":
        service_url = JOBS_SERVICE_URL
        service_key = JOBS_SERVICE_KEY
    else:
        raise ValueError(f"Unknown service type: {service_type}")
    
    # Build the URL
    url = f"{service_url}/{path}"
    
    # Add function key to headers
    request_headers = dict(headers)
    
    # Remove Azure Functions specific headers
    for header in ['host', 'x-forwarded-for', 'x-original-url', 'x-waws-unencoded-url', 'client-ip']:
        if header in request_headers:
            del request_headers[header]
    
    # Add service key
    request_headers["x-functions-key"] = service_key
    
    # Add JWT token if provided
    if token:
        request_headers["Authorization"] = f"Bearer {token}"
    
    try:
        response = requests.request(
            method=method,
            url=url,
            headers=request_headers,
            json=data if data else None,
            params=params
        )
        
        # Extract headers we want to pass back
        response_headers = {}
        for header_name in ["content-type", "location"]:
            if header_name in response.headers:
                response_headers[header_name] = response.headers[header_name]
        
        return {
            "status_code": response.status_code,
            "content": response.content,
            "headers": response_headers
        }
    except Exception as e:
        logging.error(f"Error forwarding to {service_type} service: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Error communicating with {service_type} service: {str(e)}"
        )

# Service-specific forwarding functions
async def forward_to_resume_service(
    path: str, 
    method: str, 
    headers: Dict, 
    data: Any = None, 
    params: Dict = None,
    token: Optional[str] = None
):
    """Forward request to resume service"""
    # For mutating operations, verify authentication
    if token and method != "GET":
        # Authenticated users can perform operations (both admin and non-admin)
        await get_current_active_user(await get_current_user(token))
        
    return await forward_to_service(
        service_type="resume",
        path=path,
        method=method,
        headers=headers,
        data=data,
        params=params,
        token=token
    )

async def forward_to_jobs_service(
    path: str, 
    method: str, 
    headers: Dict, 
    data: Any = None, 
    params: Dict = None,
    token: Optional[str] = None
):
    """Forward request to jobs service"""
    # For mutating operations, verify authentication
    if token and method != "GET":
        # Authenticated users can perform operations (both admin and non-admin)
        await get_current_active_user(await get_current_user(token))
        
    return await forward_to_service(
        service_type="jobs",
        path=path,
        method=method,
        headers=headers,
        data=data,
        params=params,
        token=token
    )