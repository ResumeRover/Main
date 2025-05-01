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