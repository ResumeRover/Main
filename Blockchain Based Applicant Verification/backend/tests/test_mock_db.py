import pytest
import logging
import os
import sys

# Adjust path to include the backend directory
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

try:
    from app.services.mock_db import MockDatabase
except ImportError as e:
    logging.error(f"Import error: {e}")
    raise

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@pytest.fixture
def mock_db():
    db = MockDatabase()
    yield db
    db.close()

def test_get_university_record_by_name(mock_db):
    """Test get_university_record_by_name."""
    logger.info("Testing get_university_record_by_name")
    result = mock_db.get_university_record_by_name("Test User")
    assert result is None  # Adjust based on expected behavior

def test_get_employment_record_by_name(mock_db):
    """Test get_employment_record_by_name."""
    logger.info("Testing get_employment_record_by_name")
    result = mock_db.get_employment_record_by_name("Test User")
    assert result == []  # Adjust based on expected behavior

def test_get_all_university_records(mock_db):
    """Test get_all_university_records."""
    logger.info("Testing get_all_university_records")
    result = mock_db.get_all_university_records()
    assert isinstance(result, list)

def test_get_all_employment_records(mock_db):
    """Test get_all_employment_records."""
    logger.info("Testing get_all_employment_records")
    result = mock_db.get_all_employment_records()
    assert isinstance(result, list)


def test_close(mock_db):
    """Test close method."""
    logger.info("Testing close")
    mock_db.close()
    # Add assertion if close has observable effects