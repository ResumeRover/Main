"""
Blockchain integration utilities for interacting with the Verification smart contract.
"""
import os
import json
import web3
from web3 import Web3
from typing import Dict, Any, Optional, Tuple, List
from dotenv import load_dotenv
from enum import IntEnum

# Load environment variables
load_dotenv()

# Blockchain configuration
BLOCKCHAIN_PROVIDER = os.getenv("BLOCKCHAIN_PROVIDER", "http://localhost:7545")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS", "")
ABI_PATH = os.getenv("ABI_PATH", "../blockchain/build/contracts/Verification.json")

# Verification types enum (matching the contract)
class VerificationType(IntEnum):
    GPA = 0
    EMPLOYMENT = 1
    DEGREE = 2
    CERTIFICATE = 3
