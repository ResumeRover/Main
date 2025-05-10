import pytest
import logging
import os
import sys
from fastapi.testclient import TestClient

# Adjust path to include the backend directory
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

try:
    from app.main import app
except ImportError as e:
    logging.error(f"Import error: {e}")
    raise

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = TestClient(app)

def test_root_endpoint():
    """Test the root endpoint."""
    logger.info("Testing root endpoint")
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Blockchain-Based Applicant Verification API",
        "version": "1.0.0",
        "endpoints": {
            "documentation": "/docs",
            "verification": "/verification"
        }
    }

def test_health_check_endpoint():
    """Test the health check endpoint."""
    logger.info("Testing health check endpoint")
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}