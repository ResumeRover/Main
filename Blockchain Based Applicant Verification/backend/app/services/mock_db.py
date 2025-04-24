from pymongo import MongoClient
from typing import Dict, Optional, List
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection details
MONGO_URI = "mongodb+srv://blockchainVerification:cs3023Resume_BVfy@cluster0.kxwey.mongodb.net/"
UNIVERSITY_DB = "university_db"
COMPANY_DB = "company_db"
UNIVERSITY_COLLECTION = "university_records"
COMPANY_COLLECTION = "employment_records"

class DatabaseConnection:
    """MongoDB connection handler"""
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseConnection, cls).__new__(cls)
            try:
                cls._instance.client = MongoClient(MONGO_URI)
                logger.info("MongoDB connection established")
            except Exception as e:
                logger.error(f"Failed to connect to MongoDB: {e}")
                raise
        return cls._instance
    
    def get_university_collection(self):
        """Get the university records collection"""
        return self.client[UNIVERSITY_DB][UNIVERSITY_COLLECTION]
    
    def get_company_collection(self):
        """Get the company records collection"""
        return self.client[COMPANY_DB][COMPANY_COLLECTION]
    
    def close_connection(self):
        """Close the MongoDB connection"""
        if hasattr(self, 'client'):
            self.client.close()
            logger.info("MongoDB connection closed")

def fetch_university_data_by_student_name(name: str) -> Optional[Dict]:
    """
    Fetch university data by student name
    
    Args:
        name (str): Full name of the student
        
    Returns:
        Dict or None: Student record if found, None otherwise
    """
    try:
        db_conn = DatabaseConnection()
        university_collection = db_conn.get_university_collection()
        
        # Case-insensitive search
        result = university_collection.find_one({"name": {"$regex": f"^{name}$", "$options": "i"}})
        
        if result:
            # Remove MongoDB _id field (not serializable to JSON)
            result.pop('_id', None)
            logger.info(f"Found university record for student: {name}")
            return result
        else:
            logger.info(f"No university record found for student: {name}")
            return None
            
    except Exception as e:
        logger.error(f"Error fetching university data: {e}")
        return None

def fetch_company_data_by_employee_name(name: str) -> List[Dict]:
    """
    Fetch company data by employee name
    
    Args:
        name (str): Full name of the employee
        
    Returns:
        List[Dict]: List of employment records for the employee, empty list if none found
    """
    try:
        db_conn = DatabaseConnection()
        company_collection = db_conn.get_company_collection()
        
        # Case-insensitive search
        # Using find() instead of find_one() as an employee might have multiple job records
        cursor = company_collection.find({"name": {"$regex": f"^{name}$", "$options": "i"}})
        
        results = []
        for doc in cursor:
            # Remove MongoDB _id field (not serializable to JSON)
            doc.pop('_id', None)
            results.append(doc)
        
        if results:
            logger.info(f"Found {len(results)} employment record(s) for employee: {name}")
        else:
            logger.info(f"No employment records found for employee: {name}")
            
        return results
        
    except Exception as e:
        logger.error(f"Error fetching company data: {e}")
        return []

# Additional helper functions that might be useful

def verify_student_gpa(name: str, claimed_gpa: float) -> Dict:
    """
    Verify if the claimed GPA matches the university records
    
    Args:
        name (str): Student name
        claimed_gpa (float): GPA claimed by the applicant
        
    Returns:
        Dict: Verification result with matched status and database record
    """
    student_record = fetch_university_data_by_student_name(name)
    
    if not student_record:
        return {
            "verified": False,
            "reason": "No university record found for this student",
            "record": None
        }
    
    # Check if the claimed GPA matches the record (with small tolerance for rounding)
    gpa_matches = abs(student_record["gpa"] - claimed_gpa) < 0.01
    
    return {
        "verified": gpa_matches,
        "reason": "GPA matches university records" if gpa_matches else "GPA does not match university records",
        "record": student_record
    }

def verify_employment_history(name: str, company: str, job_title: str) -> Dict:
    """
    Verify if the claimed employment history matches company records
    
    Args:
        name (str): Employee name
        company (str): Company name
        job_title (str): Job title
        
    Returns:
        Dict: Verification result with matched status and database record
    """
    employment_records = fetch_company_data_by_employee_name(name)
    
    if not employment_records:
        return {
            "verified": False,
            "reason": "No employment records found for this person",
            "record": None
        }
    
    # Find matching employment record
    matching_record = None
    for record in employment_records:
        if (record["company"].lower() == company.lower() and 
            record["job_title"].lower() == job_title.lower()):
            matching_record = record
            break
    
    if matching_record:
        return {
            "verified": True,
            "reason": "Employment details match company records",
            "record": matching_record
        }
    else:
        return {
            "verified": False,
            "reason": "Employment details do not match any company record",
            "records_found": employment_records  # Return all found records for reference
        }