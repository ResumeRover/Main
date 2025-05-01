"""
MongoDB utilities for connecting to and querying the mock databases
for university and company records.
"""
import os
from pymongo import MongoClient
from dotenv import load_dotenv
from typing import Dict, List, Optional, Any 

# Load environment variables
load_dotenv()

# MongoDB connection string
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://blockchainVerification:cs3023Resume_BVfy@cluster0.kxwey.mongodb.net/")

class MockDatabase:
    """Class to handle MongoDB operations for the mock databases."""
    
    def __init__(self):
        """Initialize MongoDB connection."""
        try:
            self.client = MongoClient(MONGO_URI)
            # Test connection
            self.client.server_info()
            print("Connected to MongoDB Atlas successfully")
            
            # Initialize database references
            self.university_db = self.client["university_db"]
            self.company_db = self.client["company_db"]
            
            # Initialize collection references
            self.university_records = self.university_db["university_records"]
            self.employment_records = self.company_db["employment_records"]
            
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            raise
    
    def get_university_record_by_name(self, name: str) -> Optional[Dict[str, Any]]:
        """
        Fetch university record for a student by name.
        
        Args:
            name: Full name of the student
            
        Returns:
            Dictionary containing student university record or None if not found
        """
        try:
            record = self.university_records.find_one({"name": name})
            return record
        except Exception as e:
            print(f"Error fetching university record: {e}")
            return None
    
    def get_university_record_by_params(self, params: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Fetch university record for a student by multiple parameters.
        
        Args:
            params: Dictionary of parameters to match (e.g., name, university, degree)
            
        Returns:
            Dictionary containing student university record or None if not found
        """
        try:
            record = self.university_records.find_one(params)
            return record
        except Exception as e:
            print(f"Error fetching university record: {e}")
            return None
    
    def get_employment_record_by_name(self, name: str) -> List[Dict[str, Any]]:
        """
        Fetch employment records for an employee by name.
        Returns all matches as a list, as one person could have multiple job records.
        
        Args:
            name: Full name of the employee
            
        Returns:
            List of dictionaries containing employment records or empty list if none found
        """
        try:
            records = list(self.employment_records.find({"name": name}))
            return records
        except Exception as e:
            print(f"Error fetching employment records: {e}")
            return []
    
    def get_employment_record_by_params(self, params: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Fetch employment records by multiple parameters.
        
        Args:
            params: Dictionary of parameters to match (e.g., name, company, job_title)
            
        Returns:
            List of dictionaries containing employment records or empty list if none found
        """
        try:
            records = list(self.employment_records.find(params))
            return records
        except Exception as e:
            print(f"Error fetching employment records: {e}")
            return []
    
    def get_all_university_records(self) -> List[Dict[str, Any]]:
        """Fetch all university records."""
        try:
            return list(self.university_records.find({}))
        except Exception as e:
            print(f"Error fetching all university records: {e}")
            return []
    
    def get_all_employment_records(self) -> List[Dict[str, Any]]:
        """Fetch all employment records."""
        try:
            return list(self.employment_records.find({}))
        except Exception as e:
            print(f"Error fetching all employment records: {e}")
            return []
    
    def insert_university_record(self, record: Dict[str, Any]) -> bool:
        """
        Insert a new university record.
        
        Args:
            record: Dictionary containing student university information
            
        Returns:
            True if successful, False otherwise
        """
        try:
            result = self.university_records.insert_one(record)
            return bool(result.inserted_id)
        except Exception as e:
            print(f"Error inserting university record: {e}")
            return False
    
    def insert_employment_record(self, record: Dict[str, Any]) -> bool:
        """
        Insert a new employment record.
        
        Args:
            record: Dictionary containing employee information
            
        Returns:
            True if successful, False otherwise
        """
        try:
            result = self.employment_records.insert_one(record)
            return bool(result.inserted_id)
        except Exception as e:
            print(f"Error inserting employment record: {e}")
            return False
    
    def close(self):
        """Close the MongoDB connection."""
        if hasattr(self, 'client'):
            self.client.close()

# Example usage
if __name__ == "__main__":
    db = MockDatabase()
    
    # Example query
    record = db.get_university_record_by_name("Kalana De Alwis")
    if record:
        print(f"Found university record: {record}")
    else:
        print("No university record found")
        
    # Close connection when done
    db.close()