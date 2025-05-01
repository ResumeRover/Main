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



class BlockchainClient:
    """Client for interacting with the Verification smart contract."""
    
    def __init__(self):
        """Initialize the blockchain client with web3 connection and contract."""
        try:
            # Connect to blockchain
            self.w3 = Web3(Web3.HTTPProvider(BLOCKCHAIN_PROVIDER))
            
            if not self.w3.is_connected():
                raise ConnectionError(f"Failed to connect to blockchain provider at {BLOCKCHAIN_PROVIDER}")
            
            print(f"Connected to blockchain: {BLOCKCHAIN_PROVIDER}")
            
            # Get contract address from environment or file
            self.contract_address = CONTRACT_ADDRESS
            if not self.contract_address:
                try:
                    # Try to read from deployed address file
                    with open("../blockchain/deployed_contract_address.json", "r") as f:
                        address_data = json.load(f)
                        self.contract_address = address_data["address"]
                except Exception as e:
                    print(f"Error loading contract address: {e}")
                    raise ValueError("Contract address not found. Please set CONTRACT_ADDRESS environment variable or ensure deployed_contract_address.json exists.")
            
            # Load contract ABI
            try:
                with open(ABI_PATH, "r") as f:
                    contract_json = json.load(f)
                    self.contract_abi = contract_json["abi"]
            except Exception as e:
                print(f"Error loading contract ABI: {e}")
                raise ValueError(f"Failed to load contract ABI from {ABI_PATH}")
            
            # Initialize contract
            self.contract = self.w3.eth.contract(
                address=self.w3.to_checksum_address(self.contract_address),
                abi=self.contract_abi
            )
            
            print(f"Contract loaded at address: {self.contract_address}")
            
            # Use the first account by default
            self.default_account = self.w3.eth.accounts[0]
            
        except Exception as e:
            print(f"Error initializing blockchain client: {e}")
            raise