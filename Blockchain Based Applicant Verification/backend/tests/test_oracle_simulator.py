import pytest
import logging
import os
import sys
from unittest.mock import patch, MagicMock

# Adjust path to include the backend directory
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, backend_path)
print(f"Adjusted sys.path: {sys.path}")  # Debug print to verify path

try:
    from app.models.schemas import VerificationType
    from app.services.oracle_simulator import OracleSimulator
    from app.services.blockchain import BlockchainClient
    from app.services.mock_db import MockDatabase
except ImportError as e:
    logging.error(f"Import error: {e}")
    raise

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@pytest.fixture
def oracle_simulator():
    with patch("app.services.oracle_simulator.MockDatabase") as mock_db_class:
        mock_db_instance = mock_db_class.return_value
        mock_db_instance.get_university_record_by_params.return_value = {
            "name": "Kalana De Alwis", "university": "NSBM", "gpa": 3.73
        }
        mock_db_instance.get_employment_record_by_params.return_value = [
            {"name": "Shehani", "company": "99X", "job_title": "Dev"}
        ]
        
        with patch("app.services.oracle_simulator.BlockchainClient") as mock_bc_class:
            mock_bc_instance = mock_bc_class.return_value
            mock_bc_instance.create_data_hash.return_value = "0x123"
            mock_bc_instance.request_verification.return_value = "0x123"
            mock_bc_instance.store_verification_result.return_value = "0x456"
            mock_bc_instance.verification_exists.return_value = False
            simulator = OracleSimulator()
            simulator.blockchain = mock_bc_instance
            yield simulator

def test_verify_and_store_on_blockchain_success(oracle_simulator):
    """Test verify_and_store_on_blockchain success."""
    logger.info("Testing verify_and_store_on_blockchain success")
    data = {"name": "Kalana De Alwis", "university": "NSBM", "gpa": 3.73}
    verification = oracle_simulator.verify_and_store_on_blockchain(data, VerificationType.GPA)
    assert verification["is_verified"] is True
    assert "Verified" in verification["details"]
    assert verification["tx_hash"] == "0x456"

def test_verify_and_store_on_blockchain_failure(oracle_simulator):
    """Test verify_and_store_on_blockchain failure."""
    logger.info("Testing verify_and_store_on_blockchain failure")
    data = {"name": "Kalana De Alwis", "university": "NSBM", "gpa": 3.73}
    with patch.object(oracle_simulator.blockchain, "store_verification_result", side_effect=Exception("Blockchain error")):
        verification = oracle_simulator.verify_and_store_on_blockchain(data, VerificationType.GPA)
        assert "error" in verification
        assert "Blockchain error" in verification.get("error", "")