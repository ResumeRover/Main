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

# Create router
router = APIRouter(
    prefix="/verification",
    tags=["verification"],
    responses={404: {"description": "Not found"}},
)

# Service dependencies
def get_db():
    db = MockDatabase()
    try:
        yield db
    finally:
        db.close()

def get_blockchain():
    blockchain = BlockchainClient()
    try:
        yield blockchain
    finally:
        pass  # No cleanup needed for blockchain client

def get_oracle():
    oracle = OracleSimulator()
    try:
        yield oracle
    finally:
        oracle.close()
