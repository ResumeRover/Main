"""
Oracle simulator to mimic Chainlink oracle behavior for data verification.
"""
import json
import time
from typing import Dict, Any, Optional, Tuple, List
from datetime import datetime
from enum import IntEnum
import sys
import os

# Fix imports to work both as module and when run directly
try:
    # Try relative import first (when imported as module)
    from .mock_db import MockDatabase
    from .blockchain import BlockchainClient, VerificationType
except ImportError:
    # Fall back to absolute import (when run as script)
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
    from app.services.mock_db import MockDatabase
    from app.services.blockchain import BlockchainClient, VerificationType

