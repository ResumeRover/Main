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

    
    def create_data_hash(self, data: Dict[str, Any]) -> str:
        """
        Create a keccak256 hash from the data dictionary.
        
        Args:
            data: Dictionary containing data to hash
            
        Returns:
            Hex string of the keccak256 hash
        """
        # Convert dictionary to sorted JSON string for consistent hashing
        data_string = json.dumps(data, sort_keys=True)
        # Create hash
        data_hash = self.w3.keccak(text=data_string).hex()
        return data_hash
    
    def request_verification(self, data_hash: str, verification_type: VerificationType, account: Optional[str] = None) -> str:
        """
        Request verification for data.
        
        Args:
            data_hash: Hash of the data to verify
            verification_type: Type of verification to perform
            account: Account to send transaction from (default: first account)
            
        Returns:
            Transaction hash
        """
        if not account:
            account = self.default_account
        
        # Convert the hex string to bytes32 format
        bytes32_hash = Web3.to_bytes(hexstr=data_hash)
        
        # Build transaction
        tx = self.contract.functions.requestVerification(
            bytes32_hash,
            int(verification_type)
        ).build_transaction({
            'from': account,
            'gas': 200000,
            'gasPrice': self.w3.to_wei('20', 'gwei'),
            'nonce': self.w3.eth.get_transaction_count(account)
        })
        
        # Sign and send transaction
        signed_tx = self.w3.eth.account.sign_transaction(tx, private_key=os.getenv("PRIVATE_KEY"))
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        return tx_hash.hex()
    
    def store_verification_result(
        self, 
        data_hash: str, 
        is_verified: bool, 
        verification_type: VerificationType, 
        details: str,
        account: Optional[str] = None
    ) -> str:
        """
        Store verification result in the blockchain.
        
        Args:
            data_hash: Hash of the data verified
            is_verified: Verification result
            verification_type: Type of verification performed
            details: Additional details about verification
            account: Account to send transaction from (default: first account)
            
        Returns:
            Transaction hash
        """
        if not account:
            account = self.default_account
        
        # Convert the hex string to bytes32 format
        bytes32_hash = Web3.to_bytes(hexstr=data_hash)
            
        # If using development environment, we can use accounts directly
        if BLOCKCHAIN_PROVIDER.endswith("7545") or BLOCKCHAIN_PROVIDER.endswith("8545"):
            # Build transaction
            tx_hash = self.contract.functions.storeVerificationResult(
                bytes32_hash,
                is_verified,
                int(verification_type),
                details
            ).transact({'from': account, 'gas': 1000000})
            
            return tx_hash.hex()
        else:
            # For production, use private key
            if not os.getenv("PRIVATE_KEY"):
                raise ValueError("PRIVATE_KEY environment variable required for non-development environments")
                
            # Build transaction
            tx = self.contract.functions.storeVerificationResult(
                bytes32_hash,
                is_verified,
                int(verification_type),
                details
            ).build_transaction({
                'from': account,
                'gas': 1000000,
                'gasPrice': self.w3.to_wei('20', 'gwei'),
                'nonce': self.w3.eth.get_transaction_count(account)
            })
            
            # Sign and send transaction
            signed_tx = self.w3.eth.account.sign_transaction(tx, private_key=os.getenv("PRIVATE_KEY"))
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            
            return tx_hash.hex()
    