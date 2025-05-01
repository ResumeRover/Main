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