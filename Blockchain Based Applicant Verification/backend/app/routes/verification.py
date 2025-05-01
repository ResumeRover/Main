"""
API routes for blockchain-based verification services.
"""
from fastapi import APIRouter, HTTPException, Depends 
from typing import List, Dict, Any

from ..services.mock_db import MockDatabase
from ..services.blockchain import BlockchainClient, VerificationType
from ..services.oracle_simulator import OracleSimulator
from ..models.schemas import (
    GPAVerificationRequest,
    DegreeVerificationRequest,
    EmploymentVerificationRequest,
    VerificationResponse,
    BlockchainStatus,
    VerificationListResponse
)
