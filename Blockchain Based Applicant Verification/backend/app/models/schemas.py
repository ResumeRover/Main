from pydantic import BaseModel, Field, validator
from typing import List, Dict, Optional, Union, Any
from datetime import date


class EducationEntry(BaseModel):
    """Education information in resume"""
    university: str
    degree: str
    gpa: float
    graduation_year: int
    
    @validator('gpa')
    def validate_gpa(cls, v):
        """Validate GPA is in normal range"""
        if not 0 <= v <= 4.0:
            raise ValueError('GPA must be between 0 and 4.0')
        return v


class EmploymentEntry(BaseModel):
    """Employment history entry in resume"""
    company: str
    job_title: str
    job_category: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    description: Optional[str] = None
    
    @validator('end_date')
    def validate_dates(cls, v, values):
        """Validate end date is after start date if provided"""
        if v and 'start_date' in values and v < values['start_date']:
            raise ValueError('End date must be after start date')
        return v


class VerificationRequest(BaseModel):
    """Main input schema for resume verification"""
    applicant_name: str
    email: str
    phone: Optional[str] = None
    education: List[EducationEntry]
    employment: List[EmploymentEntry]
    skills: Optional[List[str]] = []
    
    class Config:
        schema_extra = {
            "example": {
                "applicant_name": "Kalana De Alwis",
                "email": "kalana.dealwis@example.com",
                "phone": "+94771234567",
                "education": [
                    {
                        "university": "NSBM Green University",
                        "degree": "BSc in Software Engineering",
                        "gpa": 3.73,
                        "graduation_year": 2025
                    }
                ],
                "employment": [
                    {
                        "company": "99X Technology",
                        "job_title": "ML Engineer",
                        "job_category": "Machine Learning",
                        "start_date": "2022-05-01",
                        "end_date": "2023-11-01",
                        "description": "Built NLP models for document processing and chatbot support."
                    }
                ],
                "skills": ["Python", "Machine Learning", "NLP", "MongoDB"]
            }
        }


class VerificationItem(BaseModel):
    """Individual verification result"""
    field: str
    claimed_value: Any
    database_value: Optional[Any] = None
    verified: bool
    details: Optional[str] = None
    timestamp: Optional[int] = None  # Unix timestamp when verification occurred
    transaction_hash: Optional[str] = None  # Blockchain transaction hash
    

class BlockchainRecord(BaseModel):
    """Data structure for blockchain record"""
    data_hash: str
    is_verified: bool
    verification_type: str
    timestamp: int
    oracle_id: str


class VerificationResult(BaseModel):
    """Complete verification result response"""
    applicant_name: str
    verification_id: str  # Unique identifier for this verification session
    education_verification: List[VerificationItem]
    employment_verification: List[VerificationItem]
    overall_status: str = Field(..., description="VERIFIED, PARTIAL, FAILED")
    blockchain_status: Optional[Dict[str, Any]] = None
    timestamp: int  # Unix timestamp
    
    class Config:
        schema_extra = {
            "example": {
                "applicant_name": "Kalana De Alwis",
                "verification_id": "0x7f5e36789c3df34f1bfd",
                "education_verification": [
                    {
                        "field": "university_degree",
                        "claimed_value": "BSc in Software Engineering",
                        "database_value": "BSc in Software Engineering",
                        "verified": True,
                        "details": "Degree matches university records",
                        "timestamp": 1713886224,
                        "transaction_hash": "0x123...abc"
                    },
                    {
                        "field": "university_gpa",
                        "claimed_value": 3.73,
                        "database_value": 3.73,
                        "verified": True,
                        "details": "GPA matches university records",
                        "timestamp": 1713886224,
                        "transaction_hash": "0x123...abc"
                    }
                ],
                "employment_verification": [
                    {
                        "field": "employment_history",
                        "claimed_value": {
                            "company": "99X Technology",
                            "position": "ML Engineer"
                        },
                        "database_value": {
                            "company": "99X Technology",
                            "position": "ML Engineer",
                            "period": "May 2022 - Nov 2023"
                        },
                        "verified": True,
                        "details": "Employment history verified",
                        "timestamp": 1713886224,
                        "transaction_hash": "0x123...def"
                    }
                ],
                "overall_status": "VERIFIED",
                "blockchain_status": {
                    "network": "Ganache",
                    "contract_address": "0xabc...123",
                    "block_number": 42
                },
                "timestamp": 1713886224
            }
        }