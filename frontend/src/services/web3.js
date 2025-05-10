import { ethers } from 'ethers';

// ABI for the verification contract
const verificationABI = [
  // Example ABI for a simple verification contract
  "function verifyDocument(string memory documentHash) public returns (bool)",
  "function isVerified(string memory documentHash) public view returns (bool)",
  "function getVerificationTimestamp(string memory documentHash) public view returns (uint256)",
  "event DocumentVerified(address indexed verifier, string documentHash, uint256 timestamp)"
];

// Contract addresses - replace with actual contract addresses
const VERIFICATION_CONTRACT_ADDRESS = "0x123..."; // Replace with actual contract address

// Initialize provider and signer
let provider;
let signer;
let verificationContract;

/**
 * Connect to Web3 provider
 * @returns {Promise<{address: string, success: boolean}>}
 */
export const connectWallet = async () => {
  try {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      throw new Error("No Ethereum wallet found. Please install MetaMask.");
    }

    // Request account access if needed
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Create a provider
    provider = new ethers.providers.Web3Provider(window.ethereum);
    
    // Get the signer
    signer = provider.getSigner();
    
    // Get the address
    const address = await signer.getAddress();
    
    // Initialize contracts
    verificationContract = new ethers.Contract(
      VERIFICATION_CONTRACT_ADDRESS,
      verificationABI,
      signer
    );
    
    return { success: true, address };
  } catch (error) {
    console.error("Failed to connect to wallet:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Verify a document on the blockchain
 * @param {string} documentHash - Hash of the document to verify
 * @returns {Promise<{success: boolean, transactionHash: string}>}
 */
export const verifyDocument = async (documentHash) => {
  try {
    if (!verificationContract) {
      throw new Error("Contract not initialized. Please connect wallet first.");
    }
    
    // Call the verifyDocument function on the smart contract
    const transaction = await verificationContract.verifyDocument(documentHash);
    
    // Wait for the transaction to be mined
    const receipt = await transaction.wait();
    
    return { 
      success: true, 
      transactionHash: receipt.transactionHash 
    };
  } catch (error) {
    console.error("Failed to verify document:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if a document is verified
 * @param {string} documentHash - Hash of the document to check
 * @returns {Promise<{verified: boolean, timestamp: number}>}
 */
export const checkVerificationStatus = async (documentHash) => {
  try {
    if (!verificationContract) {
      throw new Error("Contract not initialized. Please connect wallet first.");
    }
    
    // Check if the document is verified
    const isVerified = await verificationContract.isVerified(documentHash);
    
    if (isVerified) {
      // Get the verification timestamp
      const timestamp = await verificationContract.getVerificationTimestamp(documentHash);
      return { verified: true, timestamp: timestamp.toNumber() };
    }
    
    return { verified: false, timestamp: 0 };
  } catch (error) {
    console.error("Failed to check verification status:", error);
    return { verified: false, error: error.message };
  }
};

/**
 * Get blockchain network details
 * @returns {Promise<{name: string, chainId: number}>}
 */
export const getNetworkDetails = async () => {
  try {
    if (!provider) {
      throw new Error("Provider not initialized. Please connect wallet first.");
    }
    
    const network = await provider.getNetwork();
    
    // Map network IDs to readable names
    const networkNames = {
      1: "Ethereum Mainnet",
      5: "Goerli Testnet",
      11155111: "Sepolia Testnet",
      137: "Polygon Mainnet",
      80001: "Mumbai Testnet",
      // Add more networks as needed
    };
    
    return {
      name: networkNames[network.chainId] || `Chain ID: ${network.chainId}`,
      chainId: network.chainId
    };
  } catch (error) {
    console.error("Failed to get network details:", error);
    return { error: error.message };
  }
};

/**
 * Calculate document hash (SHA-256)
 * @param {string} data - Document data
 * @returns {string} - Document hash
 */
export const calculateDocumentHash = async (data) => {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    console.error("Failed to calculate document hash:", error);
    throw error;
  }
};

// Export a simulated function for testing without blockchain
export const simulateVerification = async (documentData) => {
  // This is a mockup function for testing the UI without an actual blockchain connection
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockHash = "0x" + Math.random().toString(16).substring(2, 42);
      resolve({
        success: true,
        transactionHash: mockHash,
        timestamp: Date.now(),
        network: "Sepolia Testnet (simulated)"
      });
    }, 2000); // Simulate network delay
  });
};

export const registerDocumentOnBlockchain = async (documentId, data) => {
    try {
      // Connect to contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
      // Call smart contract function (replace with your actual method)
      const tx = await contract.registerDocument(documentId, data);
      await tx.wait();
  
      return {
        success: true,
        transactionHash: tx.hash
      };
    } catch (error) {
      console.error('Error registering document on blockchain:', error);
      throw error;
    }
  };