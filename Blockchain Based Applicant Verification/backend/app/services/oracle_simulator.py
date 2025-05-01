"""
Oracle simulator to mimic Chainlink oracle behavior for data verification.
"""
import json
import time
from typing import Dict, Any, Optional, Tuple, List
from datetime import datetime
from enum import IntEnum
import sys
import os

# Fix imports to work both as module and when run directly
try:
    # Try relative import first (when imported as module)
    from .mock_db import MockDatabase
    from .blockchain import BlockchainClient, VerificationType
except ImportError:
    # Fall back to absolute import (when run as script)
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
    from app.services.mock_db import MockDatabase
    from app.services.blockchain import BlockchainClient, VerificationType

class OracleSimulator:
    """
    Simulates Chainlink Oracle behavior to verify applicant information.
    """
    
    def __init__(self):
        """Initialize oracle with database and blockchain connections."""
        self.db = MockDatabase()
        self.blockchain = BlockchainClient()
        
    def verify_gpa(self, data: Dict[str, Any]) -> Tuple[bool, str]:
        """
        Verify GPA information against mock university database.
        
        Args:
            data: Dictionary containing name, university, and gpa to verify
            
        Returns:
            Tuple of (verification_result, details)
        """
        # Extract required fields
        name = data.get("name")
        university = data.get("university")
        claimed_gpa = data.get("gpa")
        
        if not all([name, university, claimed_gpa]):
            return False, "Missing required fields (name, university, gpa)"
        
        # Query mock database
        query_params = {"name": name, "university": university}
        record = self.db.get_university_record_by_params(query_params)
        
        if not record:
            return False, f"No records found for {name} at {university}"
        
        # Compare claimed GPA with database record
        actual_gpa = record.get("gpa")
        
        # Determine if they match (within small floating point error)
        if abs(float(claimed_gpa) - float(actual_gpa)) < 0.01:
            return True, f"Verified GPA of {actual_gpa} for {name} at {university}"
        else:
            return False, f"GPA mismatch for {name} at {university}. Claimed: {claimed_gpa}, Actual: {actual_gpa}"
