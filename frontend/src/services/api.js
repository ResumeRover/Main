import axios from 'axios';

// Base URL for API
const API_BASE_URL = 'https://api.resumerover.example.com'; // Replace with actual API endpoint

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch documents for the current user
 * @returns {Promise<Array>} List of documents
 */
export const fetchDocuments = async () => {
  try {
    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      return mockDocuments;
    }
    
    const response = await api.get('/documents');
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

/**
 * Fetch a specific document by ID
 * @param {string} documentId - Document ID
 * @returns {Promise<Object>} Document details
 */
export const fetchDocumentById = async (documentId) => {
  try {
    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      return mockDocuments.find(doc => doc.id === documentId) || mockDocuments[0];
    }
    
    const response = await api.get(`/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching document ${documentId}:`, error);
    throw error;
  }
};

/**
 * Fetch CV details by ID
 * @param {string} cvId - CV ID
 * @returns {Promise<Object>} CV details
 */
export const fetchCVDetails = async (cvId) => {
  try {
    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      return mockCVDetails;
    }
    
    const response = await api.get(`/cv/${cvId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching CV ${cvId}:`, error);
    throw error;
  }
};

/**
 * Update verification status for a document
 * @param {string} documentId - Document ID
 * @param {string} status - New status
 * @param {Object} verificationData - Blockchain verification data
 * @returns {Promise<Object>} Updated document
 */
export const updateVerificationStatus = async (documentId, status, verificationData) => {
  try {
    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      return {
        ...mockDocuments.find(doc => doc.id === documentId),
        status,
        blockchainVerification: verificationData
      };
    }
    
    const response = await api.patch(`/documents/${documentId}/verification`, {
      status,
      blockchainVerification: verificationData
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error updating verification status for ${documentId}:`, error);
    throw error;
  }
};

// Mock data for development
const mockDocuments = [
  {
    id: 'cv_001',
    name: "QueenPunch's CV",
    status: 'scanning',
    timestamps: {
      uploaded: '1 hr 3mins ago',
      processed: '14 mins ago',
      scanning: 'In progress...',
      verified: null,
      feedback: null
    },
    dates: {
      uploaded: '27 Nov 2024 9:15',
      processed: '27 Nov 2024, 10:00',
      scanning: null,
      verified: null,
      feedback: null
    }
  },
  {
    id: 'cv_002',
    name: "JohnDoe's CV",
    status: 'processed',
    timestamps: {
      uploaded: '3 hrs ago',
      processed: '45 mins ago',
      scanning: null,
      verified: null,
      feedback: null
    },
    dates: {
      uploaded: '27 Nov 2024 7:30',
      processed: '27 Nov 2024, 9:45',
      scanning: null,
      verified: null,
      feedback: null
    }
  }
];

const mockCVDetails = {
  personName: 'Sarah Johnson',
  cv_id: 'CV_9872364',
  verificationStatus: 'Scanning',
  education: [
    { institution: 'Stanford University', degree: 'MS Computer Science', years: '2018-2020', verified: true },
    { institution: 'UC Berkeley', degree: 'BS Computer Engineering', years: '2014-2018', verified: true }
  ],
  experience: [
    { company: 'Google', position: 'Software Engineer', years: '2020-Present', verified: true },
    { company: 'Microsoft', position: 'Software Development Intern', years: '2019', verified: false }
  ],
  skills: ['React', 'Ethereum', 'Smart Contracts', 'Node.js', 'Solidity', 'TypeScript'],
  blockchainVerification: {
    transactionHash: '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5',
    verifiedOn: '27 Nov 2024',
    networkName: 'Ethereum Sepolia'
  }
};

/**
 * Upload a document to the server
 * @param {File} file - File object to upload
 * @returns {Promise<Object>} Uploaded document details
 */
export const uploadDocument = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  };

  export const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  
    return response.data;
  };

  export const getResumeAnalysis = async (resumeId) => {
    try {
      const response = await api.get(`/nlp/analyze/${resumeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting analysis for resume ${resumeId}:`, error);
      throw error;
    }
  };

  export const getCandidateRankings = async () => {
    try {
      const response = await api.get('/ai/rankings'); // Replace with actual endpoint
      return response.data;
    } catch (error) {
      console.error('Error fetching candidate rankings:', error);
      throw error;
    }
  };

  export const getFairnessMetrics = async () => {
    try {
      const response = await api.get('/ai/fairness'); // Replace with actual endpoint
      return response.data;
    } catch (error) {
      console.error('Error fetching fairness metrics:', error);
      throw error;
    }
  };

  export const getAnalyticsData = async () => {
    try {
      const response = await api.get('/analytics'); // Update the endpoint if different
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  };
  
  