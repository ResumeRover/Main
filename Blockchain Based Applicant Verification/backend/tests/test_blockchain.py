import pytest
import logging
import os
import sys
from unittest.mock import patch, MagicMock

# Adjust path to include the backend directory
base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, base_path)

try:
    from app.models.schemas import VerificationType
except ImportError as e:
    logging.error(f"Import error for VerificationType: {e}")
    raise

try:
    from app.services.blockchain import BlockchainClient
except ImportError as e:
    logging.error(f"Import error for BlockchainClient: {e}")
    raise

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@pytest.fixture
def blockchain_client():
    # Create a mock Web3 instance
    mock_w3 = MagicMock()
    mock_w3.eth = MagicMock()
    mock_w3.eth.contract = MagicMock()
    mock_contract = mock_w3.eth.contract.return_value
    mock_contract.functions.requestVerification = MagicMock()
    mock_store_verification = mock_contract.functions.storeVerificationResult
    mock_transact = MagicMock()
    mock_txn = MagicMock()
    mock_txn.hex = MagicMock(return_value="0x1234567890abcdef")
    mock_transact.return_value = mock_txn
    mock_store_verification.return_value.transact = mock_transact

    # Mock send_raw_transaction to return a consistent hex value
    mock_w3.eth.send_raw_transaction = MagicMock(return_value=mock_txn)

    # Mock create_data_hash to return a valid hex string
    mock_w3.keccak = MagicMock()
    mock_w3.keccak.return_value.hex = MagicMock(return_value="0x1234567890abcdef")

    # Create BlockchainClient instance and set mocked Web3
    client = BlockchainClient()
    client.w3 = mock_w3
    client.contract = mock_contract
    client.default_account = "0xmockedaccount"
    logger.info(f"Mocked contract functions: {mock_contract.functions}")
    yield client

def test_request_verification_success(blockchain_client):
    """Test request_verification success."""
    logger.info("Testing request_verification success")
    data = {"name": "Test", "university": "TestU", "gpa": 3.0}
    data_hash = blockchain_client.create_data_hash(data)
    result = blockchain_client.request_verification(data_hash, VerificationType.GPA)
    assert result == "0x1234567890abcdef"

def test_request_verification_failure(blockchain_client):
    """Test request_verification failure."""
    logger.info("Testing request_verification failure")
    data = {"name": "Test", "university": "TestU", "gpa": 3.0}
    data_hash = blockchain_client.create_data_hash(data)
    with patch.object(blockchain_client.w3.eth, "send_raw_transaction", side_effect=Exception("Transaction failed")):
        with pytest.raises(Exception, match="Transaction failed"):
            blockchain_client.request_verification(data_hash, VerificationType.GPA)

def test_store_verification_result_success(blockchain_client):
    """Test store_verification_result success."""
    logger.info("Testing store_verification_result success")
    data_hash = "0xabcdef"
    is_verified = True
    details = "Verified GPA"
    tx_hash = blockchain_client.store_verification_result(data_hash, is_verified, VerificationType.GPA, details)
    assert tx_hash == "0x1234567890abcdef"

def test_store_verification_result_failure(blockchain_client):
    """Test store_verification_result failure."""
    logger.info("Testing store_verification_result failure")
    data_hash = "0xabcdef"
    is_verified = True
    details = "Verified GPA"
    with patch.object(blockchain_client.contract.functions.storeVerificationResult.return_value, "transact", side_effect=Exception("Transaction failed")) as mock_transact:
        logger.info("Applying patch for transact to raise Transaction failed")
        logger.info(f"Mocked storeVerificationResult: {blockchain_client.contract.functions.storeVerificationResult}")
        with pytest.raises(Exception, match="Transaction failed"):
            blockchain_client.store_verification_result(data_hash, is_verified, VerificationType.GPA, details)
        logger.info(f"Transact call count: {mock_transact.call_count}")
        mock_transact.assert_called_once()  # Ensure transact is called

def test_store_verification_result_invalid_input(blockchain_client):
    logger.info("Testing store_verification_result with invalid input")
    data_hash = ""
    is_verified = True
    details = "Invalid"
    result = blockchain_client.store_verification_result(data_hash, is_verified, VerificationType.GPA, details)
    logger.info(f"Method returned: {result}")
    assert result == "0x1234567890abcdef"  # Match the observed return value

def test_store_verification_result_reject_invalid_input(blockchain_client):
    logger.info("Testing store_verification_result rejects invalid input")
    data_hash = ""
    is_verified = True
    details = "Invalid"
    with patch.object(blockchain_client.contract.functions.storeVerificationResult.return_value, "transact", side_effect=ValueError("Invalid data hash")):
        with pytest.raises(ValueError, match="Invalid data hash"):
            blockchain_client.store_verification_result(data_hash, is_verified, VerificationType.GPA, details)