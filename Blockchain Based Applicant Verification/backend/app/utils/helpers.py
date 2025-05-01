"""
Helper utilities for the blockchain verification system.
"""
import json
import hashlib
from typing import Dict, Any, Optional
from datetime import datetime, timezone

def create_hash(data: Dict[str, Any]) -> str:
    """
    Create a deterministic hash from a dictionary.
    
    Args:
        data: Dictionary to hash
        
    Returns:
        Hex string of the hash
    """
    # Ensure consistent serialization by sorting keys
    serialized = json.dumps(data, sort_keys=True)
    # Create SHA-256 hash
    hash_obj = hashlib.sha256(serialized.encode())
    return "0x" + hash_obj.hexdigest()

def timestamp_to_datetime(timestamp: int) -> str:
    """
    Convert Unix timestamp to ISO datetime string.
    
    Args:
        timestamp: Unix timestamp
        
    Returns:
        ISO formatted datetime string
    """
    dt = datetime.fromtimestamp(timestamp, tz=timezone.utc)
    return dt.isoformat()

def format_blockchain_address(address: str) -> str:
    """
    Format blockchain address for display.
    
    Args:
        address: Ethereum address
        
    Returns:
        Formatted address (first 6 chars...last 4 chars)
    """
    if not address:
        return ""
        
    if address.startswith("0x"):
        return f"{address[:8]}...{address[-6:]}"
    else:
        return f"0x{address[:6]}...{address[-4:]}"