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