import hashlib
from eth_hash.auto import keccak
from typing import Any, Dict, Tuple, Union, Optional
import time
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def generate_hash(input_string: str) -> str:
    """
    Generate a keccak256 hash for the input string
    
    Args:
        input_string (str): String to hash
        
    Returns:
        str: Hex representation of keccak256 hash
    """
    try:
        # Convert input string to bytes
        input_bytes = input_string.encode('utf-8')
        
        # Generate keccak256 hash
        hash_bytes = keccak(input_bytes)
        
        # Convert to hex string
        hash_hex = '0x' + hash_bytes.hex()
        
        return hash_hex
    except Exception as e:
        logger.error(f"Error generating hash: {e}")
        # Fallback to SHA256 if keccak fails
        sha256_hash = hashlib.sha256(input_string.encode('utf-8')).hexdigest()
        return f"0x{sha256_hash}"

def generate_verification_id(applicant_name: str) -> str:
    """
    Generate a unique verification ID based on applicant name and timestamp
    
    Args:
        applicant_name (str): Name of the applicant
        
    Returns:
        str: Unique verification ID
    """
    timestamp = int(time.time())
    input_string = f"{applicant_name}:{timestamp}"
    full_hash = generate_hash(input_string)
    
    # Return first 20 characters of the hash for brevity
    return full_hash[:20]

def compare_fields(claimed_value: Any, actual_value: Any, field_type: str = "string") -> Tuple[bool, str]:
    """
    Compare claimed value with actual value from database
    
    Args:
        claimed_value (Any): Value claimed in the resume
        actual_value (Any): Value from the database
        field_type (str): Type of field being compared
        
    Returns:
        Tuple[bool, str]: (is_match, reason)
    """
    if claimed_value is None or actual_value is None:
        return False, "Missing value for comparison"
    
    if field_type == "gpa":
        # For GPA, allow small difference due to rounding
        try:
            claimed_float = float(claimed_value)
            actual_float = float(actual_value)
            
            # Check if the difference is less than 0.01
            if abs(claimed_float - actual_float) < 0.01:
                return True, "GPA verified successfully"
            else:
                return False, f"GPA mismatch: claimed {claimed_float}, actual {actual_float}"
        except (ValueError, TypeError):
            return False, "Invalid GPA format"
    
    elif field_type == "string":
        # Case-insensitive string comparison
        if isinstance(claimed_value, str) and isinstance(actual_value, str):
            if claimed_value.lower().strip() == actual_value.lower().strip():
                return True, "String values match"
            else:
                return False, "String values do not match"
        else:
            return False, "Invalid string format for comparison"
    
    elif field_type == "job":
        # Job comparison (checking company and title)
        claimed_company = claimed_value.get("company", "").lower().strip()
        claimed_title = claimed_value.get("job_title", "").lower().strip()
        
        actual_company = actual_value.get("company", "").lower().strip()
        actual_title = actual_value.get("job_title", "").lower().strip()
        
        if claimed_company == actual_company and claimed_title == actual_title:
            return True, "Employment details verified"
        elif claimed_company != actual_company:
            return False, f"Company mismatch: claimed {claimed_company}, actual {actual_company}"
        else:
            return False, f"Job title mismatch: claimed {claimed_title}, actual {actual_title}"
    
    elif field_type == "date":
        # Date comparison
        try:
            # Convert string dates to datetime objects if needed
            if isinstance(claimed_value, str):
                claimed_date = datetime.fromisoformat(claimed_value.replace('Z', '+00:00'))
            else:
                claimed_date = claimed_value
                
            if isinstance(actual_value, str):
                actual_date = datetime.fromisoformat(actual_value.replace('Z', '+00:00'))
            else:
                actual_date = actual_value
            
            # Compare dates (ignoring time)
            if claimed_date.date() == actual_date.date():
                return True, "Date verified successfully"
            else:
                return False, f"Date mismatch: claimed {claimed_date.date()}, actual {actual_date.date()}"
        except (ValueError, TypeError, AttributeError):
            return False, "Invalid date format"
    
    else:
        # Default equality check
        if claimed_value == actual_value:
            return True, f"{field_type} verified successfully"
        else:
            return False, f"{field_type} mismatch: claimed {claimed_value}, actual {actual_value}"

def create_verification_item(field: str, claimed_value: Any, database_value: Any, 
                            field_type: str = "string", transaction_hash: Optional[str] = None) -> Dict:
    """
    Create a verification item result
    
    Args:
        field (str): Field name being verified
        claimed_value (Any): Value claimed in resume
        database_value (Any): Value from database
        field_type (str): Type of field for comparison
        transaction_hash (Optional[str]): Blockchain transaction hash
        
    Returns:
        Dict: Verification item result
    """
    is_verified, details = compare_fields(claimed_value, database_value, field_type)
    
    return {
        "field": field,
        "claimed_value": claimed_value,
        "database_value": database_value,
        "verified": is_verified,
        "details": details,
        "timestamp": int(time.time()),
        "transaction_hash": transaction_hash
    }

def determine_overall_status(verification_items: list) -> str:
    """
    Determine overall verification status based on individual verification results
    
    Args:
        verification_items (list): List of verification item dictionaries
        
    Returns:
        str: "VERIFIED", "PARTIAL", or "FAILED"
    """
    if not verification_items:
        return "FAILED"
    
    verified_count = sum(1 for item in verification_items if item.get("verified", False))
    total_count = len(verification_items)
    
    if verified_count == total_count:
        return "VERIFIED"
    elif verified_count > 0:
        return "PARTIAL"
    else:
        return "FAILED"

def format_date_range(start_date: Union[str, datetime], end_date: Optional[Union[str, datetime]] = None) -> str:
    """
    Format date range for display
    
    Args:
        start_date (Union[str, datetime]): Start date
        end_date (Optional[Union[str, datetime]]): End date
        
    Returns:
        str: Formatted date range string
    """
    # Convert string dates to datetime objects if needed
    if isinstance(start_date, str):
        start_date = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
    
    if end_date:
        if isinstance(end_date, str):
            end_date = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
        return f"{start_date.strftime('%b %Y')} - {end_date.strftime('%b %Y')}"
    else:
        return f"{start_date.strftime('%b %Y')} - Present"