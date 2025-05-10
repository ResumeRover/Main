import pytest
import logging
import os
import sys
import warnings
from datetime import datetime, timezone
import hashlib
import json

# Add backend directory to sys.path to ensure module imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

try:
    from app.utils.helpers import (
        create_hash,
        timestamp_to_datetime,
        format_blockchain_address,
        format_verification_type,
        format_verification_result,
    )
except ImportError as e:
    logging.error(f"Import error: {e}")
    raise

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_create_hash():
    """Test creating a deterministic hash from a dictionary."""
    logger.info("Testing create_hash")
    
    data = {
        "name": "Kalana De Alwis",
        "university": "NSBM Green University",
        "gpa": 3.73
    }
    
    # Correct expected hash for the given data
    serialized = json.dumps(data, sort_keys=True)
    expected_hash = "0x" + hashlib.sha256(serialized.encode()).hexdigest()
    
    result = create_hash(data)
    assert result.startswith("0x")
    assert len(result) == 66  # "0x" + 64 hex chars for SHA-256
    assert result == expected_hash

    # Test with same data but different key order (should produce same hash)
    data_unordered = {
        "gpa": 3.73,
        "university": "NSBM Green University",
        "name": "Kalana De Alwis"
    }
    assert create_hash(data_unordered) == result

def test_create_hash_empty():
    """Test creating a hash with an empty dictionary."""
    logger.info("Testing create_hash with empty dictionary")
    
    data = {}
    result = create_hash(data)
    assert result.startswith("0x")
    assert len(result) == 66
    
    # Expected hash for empty dictionary
    expected_hash = "0x" + hashlib.sha256(json.dumps({}, sort_keys=True).encode()).hexdigest()
    print(f"Expected hash: {expected_hash}")
    print(f"Actual hash: {result}")
    assert result == expected_hash

def test_timestamp_to_datetime():
    """Test converting Unix timestamp to ISO datetime string."""
    logger.info("Testing timestamp_to_datetime")
    
    timestamp = 1714896000  # May 5, 2024, 08:00:00 UTC
    result = timestamp_to_datetime(timestamp)
    assert result == "2024-05-05T08:00:00+00:00"

def test_timestamp_to_datetime_zero():
    """Test converting zero timestamp to ISO datetime string."""
    logger.info("Testing timestamp_to_datetime with zero timestamp")
    
    timestamp = 0  # January 1, 1970, 00:00:00 UTC
    result = timestamp_to_datetime(timestamp)
    assert result == "1970-01-01T00:00:00+00:00"

def test_format_blockchain_address_with_prefix():
    """Test formatting a blockchain address with 0x prefix."""
    logger.info("Testing format_blockchain_address with 0x prefix")
    
    address = "0x1234567890abcdef1234567890abcdef12345678"
    result = format_blockchain_address(address)
    assert result == "0x123456...345678"

def test_format_blockchain_address_without_prefix():
    """Test formatting a blockchain address without 0x prefix."""
    logger.info("Testing format_blockchain_address without 0x prefix")
    
    address = "1234567890abcdef1234567890abcdef12345678"
    result = format_blockchain_address(address)
    assert result == "0x123456...5678"

def test_format_blockchain_address_empty():
    """Test formatting an empty blockchain address."""
    logger.info("Testing format_blockchain_address with empty address")
    
    address = ""
    result = format_blockchain_address(address)
    assert result == ""

def test_format_verification_type():
    """Test converting verification type index to human-readable string."""
    logger.info("Testing format_verification_type")
    
    assert format_verification_type(0) == "GPA Verification"
    assert format_verification_type(1) == "Employment Verification"
    assert format_verification_type(2) == "Degree Verification"
    assert format_verification_type(3) == "Certificate Verification"

def test_format_verification_type_invalid():
    """Test converting an invalid verification type index."""
    logger.info("Testing format_verification_type with invalid index")
    
    assert format_verification_type(999) == "Unknown Verification Type"

def test_format_verification_result():
    """Test formatting a verification result for display."""
    logger.info("Testing format_verification_result")
    
    result = {
        "is_verified": True,
        "verification_type": 0,  # GPA Verification
        "timestamp": 1714896000,  # May 5, 2024, 08:00:00 UTC
        "oracle_address": "0x1234567890abcdef1234567890abcdef12345678",
        "details": "Verified"
    }
    
    formatted = format_verification_result(result)
    
    assert formatted["is_verified"] is True
    assert formatted["verification_type"] == "GPA Verification"
    assert formatted["timestamp"] == 1714896000
    assert formatted["formatted_time"] == "2024-05-05T08:00:00+00:00"
    assert formatted["oracle_address"] == "0x1234567890abcdef1234567890abcdef12345678"
    assert formatted["formatted_oracle"] == "0x123456...345678"
    assert formatted["details"] == "Verified"

def test_format_verification_result_missing_fields():
    """Test formatting a verification result with missing fields."""
    logger.info("Testing format_verification_result with missing fields")
    
    result = {
        "is_verified": False,
        "details": "Not found"
    }
    
    formatted = format_verification_result(result)
    
    assert formatted["is_verified"] is False
    assert formatted["details"] == "Not found"
    assert "verification_type" not in formatted
    assert "formatted_time" not in formatted
    assert "formatted_oracle" not in formatted