// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Verification
 * @dev Contract for blockchain-based resume verification
 */
contract Verification {
    // Define verification types
    enum VerificationType { GPA, Employment, Degree, Certificate }
    
    // Structure to store verification data
    struct VerificationRecord {
        bytes32 dataHash;      // Hash of the data being verified
        bool isVerified;       // Verification result
        VerificationType verificationType;  // Type of verification
        uint256 timestamp;     // When verification occurred
        address oracleAddress; // Address of oracle that performed verification
        string details;        // Additional details (optional)
    }
    
    // Mapping from data hash to verification record
    mapping(bytes32 => VerificationRecord) public verifications;
    
    // Array to store all verification hashes for lookup
    bytes32[] public verificationHashes;
    
    // Owner of the contract
    address public owner;
    
    // Authorized oracles that can submit verifications
    mapping(address => bool) public authorizedOracles;
  