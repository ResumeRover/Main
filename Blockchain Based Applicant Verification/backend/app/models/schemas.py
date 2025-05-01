"""
Pydantic models for request/response validation.
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from enum import IntEnum

class VerificationType(IntEnum):
    """Verification types matching the smart contract."""
    GPA = 0
    EMPLOYMENT = 1
    DEGREE = 2
    CERTIFICATE = 3

class GPAVerificationRequest(BaseModel):
    """Request model for GPA verification."""
    name: str = Field(..., description="Full name of the student")
    university: str = Field(..., description="Name of the university")
    gpa: float = Field(..., description="GPA value to verify", ge=0.0, le=4.0)
    
    class Config:
        schema_extra = {
            "example": {
                "name": "Kalana De Alwis",
                "university": "NSBM Green University",
                "gpa": 3.73
            }
        }

class DegreeVerificationRequest(BaseModel):
    """Request model for degree verification."""
    name: str = Field(..., description="Full name of the student")
    university: str = Field(..., description="Name of the university")
    degree: str = Field(..., description="Degree name to verify")
    
    class Config:
        schema_extra = {
            "example": {
                "name": "Kalana De Alwis",
                "university": "NSBM Green University",
                "degree": "BSc in Software Engineering"
            }
        }

class EmploymentVerificationRequest(BaseModel):
    """Request model for employment verification."""
    name: str = Field(..., description="Full name of the employee")
    company: str = Field(..., description="Name of the company")
    job_title: Optional[str] = Field(None, description="Job title (optional)")
    
    class Config:
        schema_extra = {
            "example": {
                "name": "Shehani Jayawardena",
                "company": "99X Technology",
                "job_title": "ML Engineer" 
            }
        }
