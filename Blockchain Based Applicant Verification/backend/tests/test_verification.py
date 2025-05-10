import pytest
import logging
import os
import sys
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

# Adjust path to include the backend directory
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

try:
    from app.main import app
    from app.services.oracle_simulator import OracleSimulator
    from app.services.blockchain import BlockchainClient
    from app.services.mock_db import MockDatabase
except ImportError as e:
    logging.error(f"Import error: {e}")
    raise

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = TestClient(app)

@pytest.fixture
def mock_dependencies():
    with patch("app.routes.verification.OracleSimulator") as mock_os:
        mock_os_instance = mock_os.return_value
        mock_os_instance.verify_and_store_on_blockchain.return_value = {
            "data": {"name": "Test", "university": "TestU", "gpa": 3.0},
            "data_hash": "0x1234567890abcdef",
            "is_verified": False,
            "verification_type": "GPA",
            "details": "Error",
            "timestamp": 1623456789,
            "tx_hash": "0x456",
            "status": "new"
        }
        
        with patch("app.routes.verification.BlockchainClient") as mock_bc:
            mock_bc_instance = mock_bc.return_value
            mock_bc_instance.get_verification_status.return_value = {"is_verified": True}
            
            with patch("app.routes.verification.MockDatabase") as mock_db:
                mock_db_instance = mock_db.return_value
                mock_db_instance.get_university_record_by_params.return_value = {"name": "Test User"}
                mock_db_instance.get_employment_record_by_params.return_value = [{"name": "Test User"}]
                yield

def test_get_verification(mock_dependencies):
    """Test the get_verification endpoint."""
    logger.info("Testing get_verification")
    response = client.get("/verification/test_hash")
    assert response.status_code == 200
    assert "is_verified" in response.json()

def test_verify_gpa_error(mock_dependencies):
    """Test verify_gpa with error case."""
    logger.info("Testing verify_gpa with error")
    response = client.post("/verification/gpa", json={"name": "Test", "university": "TestU", "gpa": 3.0})
    assert response.status_code == 200
    assert response.json()["is_verified"] is False
    assert "Error" in response.json()["details"]