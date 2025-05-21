import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import JobRolePanel from './components/JobRolePanel';
import DocumentStatus from './components/group11/DocumentStatus';
import CVDetails from './components/group11/CVDetails';
import VerificationForm from './components/group11/VerificationForm';
import ResumeUploader from './components/group9/ResumeUploader';
import NLPResults from './components/group9/NLPResults';
import CandidateRanking from './components/group10/CandidateRanking';
import FairnessMetrics from './components/group10/FairnessMetrics';
import AnalyticsDashboard from './components/group12/AnalyticsDashboard';
import PredictiveModel from './components/group12/PredictiveModel';
import JobRolesPage from './components/group12/JobRolesPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin Panel Component - Uses useNavigate hook which must be used inside Router context
const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeGroup, setActiveGroup] = useState('groupnone');
  const [activeTab, setActiveTab] = useState('job-role-panel');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState({
    name: "HR Administrator",
    role: "Admin Panel",
    email: "admin@resume-rover.com",
    avatar: null
  });
  
  const searchRef = useRef(null);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const notesRef = useRef(null);

  const profileModalRef = useRef(null);
  const settingsModalRef = useRef(null);
  
  const handleLogout = () => {
    setIsLoggingOut(true);
    
    // Simulate API call or cleanup
    setTimeout(() => {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_type');
      // Don't remove userData if you want to remember the last logged in user
      
      // Redirect to login after animation completes
      navigate('/Resume_Rover_Main/login');
    }, 1500);
  };
  
  // Add custom CSS to handle overlays
  useEffect(() => {
    // Create the style element
    const style = document.createElement('style');
    style.textContent = `
      body {
        overflow-x: hidden;
      }
      
      .dropdown-container {
        position: relative;
      }
      
      .overlay-panel {
        position: fixed;
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
        background-color: rgba(17, 24, 39, 0.95);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(55, 65, 81, 0.5);
        z-index: 9999;
        animation: slideIn 0.3s ease-out forwards;
      }
      
      @keyframes slideIn {
        from { 
          opacity: 0; 
          transform: translateY(-20px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        z-index: 9998;
        animation: fadeIn 0.2s ease-out forwards;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    // Clean up when component unmounts
    return () => {
      document.head.removeChild(style);
    };

    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
  }
  }, []);
  
  // Function to calculate positions for dropdown overlays
  const getOverlayPosition = (ref) => {
    if (!ref.current) return {};
    
    const rect = ref.current.getBoundingClientRect();
    const right = window.innerWidth - rect.right;
    
    return {
      top: `${rect.bottom + 12}px`,
      right: `${right}px`
    };
  };
  
  // Menu items for the sidebar
  const groups = [
    { id: 'groupnone', name: 'Create Job', icon: 'M10 16v-1H3.01L3 19c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-4h-7v1h-4zm10-9h-4.01V5l-2-2h-4l-2 2v2H4c-1.1 0-2 .9-2 2v3c0 1.11.89 2 2 2h6v-2h4v2h6c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-6 0h-4V5h4v2z' },
    { id: 'group10', name: 'Candidate Ranking', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'group12', name: 'Real Time Analytics', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' }
  ];
  
  // Tabs for each group
  const tabs = {
    dashboard: [
      { id: 'dashboard-main', name: 'Main Dashboard' }
    ],
    groupnone: [
      { id: 'job-role-panel', name: 'Job Role Panel' }
    ],
    group9: [
      { id: 'resume-uploader', name: 'Resume Uploader' },
      { id: 'nlp-results', name: 'NLP Results' }
    ],
    group10: [
      { id: 'candidate-ranking', name: 'Candidate Ranking' },
    ],
    group11: [
      { id: 'cv-details', name: 'CV Details' },
      { id: 'document-status', name: 'Document Status' },
      { id: 'verification-form', name: 'Verification Form' }
    ],
    group12: [
      { id: 'analytics-dashboard', name: 'Analytics Dashboard' },
      { id: 'predictive-model', name: 'Predictive Model' },
      { id: 'job-roles-page', name: 'Job Roles' }
    ]
  };

  return (
    <div className="flex h-screen text-white">
      {/* Sidebar */}
      <div className="w-60 bg-gray-950/50 bg-opacity-70 backdrop-blur-xl rounded-r-2xl flex flex-col shadow-xl border-r border-gray-800/40 perspective-[1000px]">
        <div className="p-7 border-b border-gray-800/40">
          <div className="flex items-center space-x-1">
            <svg viewBox="0 0 72 42" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="140" height="45">
              <path d="M3.79422 17V2.8H10.3142C11.0076 2.8 11.6476 2.94 12.2342 3.22C12.8209 3.5 13.3276 3.88 13.7542 4.36C14.1809 4.82667 14.5076 5.35333 14.7342 5.94C14.9742 6.52667 15.0942 7.12 15.0942 7.72C15.0942 8.26667 15.0142 8.79333 14.8542 9.3C14.6942 9.80667 14.4609 10.2733 14.1542 10.7C13.8476 11.1133 13.4809 11.4733 13.0542 11.78L16.0542 17H11.7742L9.27422 12.64H7.69422V17H3.79422ZM7.69422 9.24H10.1542C10.3142 9.24 10.4676 9.18 10.6142 9.06C10.7609 8.94 10.8809 8.76667 10.9742 8.54C11.0809 8.31333 11.1342 8.04 11.1342 7.72C11.1342 7.38667 11.0742 7.11333 10.9542 6.9C10.8476 6.67333 10.7076 6.5 10.5342 6.38C10.3742 6.26 10.2142 6.2 10.0542 6.2H7.69422V9.24ZM23.4503 17.2C22.717 17.2 22.037 17.06 21.4103 16.78C20.7836 16.4867 20.237 16.0933 19.7703 15.6C19.317 15.0933 18.957 14.5133 18.6903 13.86C18.437 13.1933 18.3103 12.4933 18.3103 11.76C18.3103 10.7733 18.5303 9.88 18.9703 9.08C19.4103 8.28 20.017 7.64 20.7903 7.16C21.5636 6.66667 22.4303 6.42 23.3903 6.42C24.377 6.42 25.2503 6.66667 26.0103 7.16C26.7703 7.65333 27.3703 8.30667 27.8103 9.12C28.2636 9.92 28.4903 10.8 28.4903 11.76C28.4903 11.84 28.4903 11.92 28.4903 12C28.4903 12.08 28.4836 12.1467 28.4703 12.2H19.3503C19.4036 12.9867 19.6236 13.7 20.0103 14.34C20.397 14.98 20.8903 15.4867 21.4903 15.86C22.1036 16.22 22.7703 16.4 23.4903 16.4C24.2103 16.4 24.8903 16.2133 25.5303 15.84C26.1703 15.4667 26.617 14.9867 26.8703 14.4L27.7503 14.64C27.5503 15.1333 27.2303 15.5733 26.7903 15.96C26.3636 16.3467 25.857 16.6533 25.2703 16.88C24.697 17.0933 24.0903 17.2 23.4503 17.2ZM19.3103 11.42H27.5303C27.477 10.6067 27.2636 9.88667 26.8903 9.26C26.517 8.63333 26.0236 8.14 25.4103 7.78C24.8103 7.42 24.1436 7.24 23.4103 7.24C22.677 7.24 22.0103 7.42 21.4103 7.78C20.8103 8.14 20.3236 8.63333 19.9503 9.26C19.577 9.88667 19.3636 10.6067 19.3103 11.42ZM35.3705 17.2C34.5438 17.2 33.7771 17.06 33.0705 16.78C32.3638 16.5 31.7438 16.0733 31.2105 15.5L31.6705 14.8C32.2438 15.3467 32.8238 15.7467 33.4105 16C33.9971 16.24 34.6371 16.36 35.3305 16.36C36.2238 16.36 36.9438 16.1733 37.4905 15.8C38.0505 15.4267 38.3305 14.9067 38.3305 14.24C38.3305 13.7867 38.1971 13.44 37.9305 13.2C37.6771 12.9467 37.3038 12.7467 36.8105 12.6C36.3305 12.44 35.7438 12.2733 35.0505 12.1C34.3438 11.9133 33.7438 11.72 33.2505 11.52C32.7705 11.32 32.4105 11.06 32.1705 10.74C31.9305 10.42 31.8105 9.98667 31.8105 9.44C31.8105 8.76 31.9771 8.2 32.3105 7.76C32.6571 7.30667 33.1171 6.97333 33.6905 6.76C34.2771 6.53333 34.9238 6.42 35.6305 6.42C36.4438 6.42 37.1505 6.55333 37.7505 6.82C38.3638 7.08667 38.8305 7.44 39.1505 7.88L38.6105 8.52C38.2771 8.09333 37.8438 7.78 37.3105 7.58C36.7771 7.36667 36.1905 7.26 35.5505 7.26C35.0705 7.26 34.6171 7.32667 34.1905 7.46C33.7638 7.59333 33.4171 7.81333 33.1505 8.12C32.8971 8.41333 32.7705 8.81333 32.7705 9.32C32.7705 9.72 32.8638 10.0333 33.0505 10.26C33.2505 10.4867 33.5438 10.6733 33.9305 10.82C34.3171 10.9533 34.7971 11.1 35.3705 11.26C36.1838 11.46 36.8838 11.6667 37.4705 11.88C38.0571 12.0933 38.5105 12.3733 38.8305 12.72C39.1505 13.0533 39.3105 13.5267 39.3105 14.14C39.3105 15.0867 38.9505 15.8333 38.2305 16.38C37.5105 16.9267 36.5571 17.2 35.3705 17.2ZM42.9608 12.6V6.6H43.9608V12.46C43.9608 13.7533 44.1741 14.72 44.6008 15.36C45.0408 15.9867 45.7008 16.3 46.5808 16.3C47.1674 16.3 47.7274 16.1733 48.2608 15.92C48.8074 15.6533 49.2874 15.2867 49.7008 14.82C50.1141 14.34 50.4208 13.7867 50.6208 13.16V6.6H51.6208V15.68C51.6208 15.84 51.6541 15.96 51.7208 16.04C51.8008 16.12 51.9074 16.1667 52.0408 16.18V17C51.9074 17.0133 51.8008 17.02 51.7208 17.02C51.6541 17.02 51.5941 17.0133 51.5408 17C51.3141 16.9733 51.1274 16.88 50.9808 16.72C50.8341 16.5467 50.7541 16.34 50.7408 16.1L50.7208 14.54C50.2674 15.3667 49.6408 16.02 48.8408 16.5C48.0541 16.9667 47.2008 17.2 46.2808 17.2C45.1874 17.2 44.3608 16.8133 43.8008 16.04C43.2408 15.2667 42.9608 14.12 42.9608 12.6ZM71.4791 17H70.4791V11.2C70.4791 9.88 70.2724 8.90667 69.8591 8.28C69.4591 7.65333 68.8391 7.34 67.9991 7.34C67.1457 7.34 66.3857 7.64667 65.7191 8.26C65.0657 8.86 64.6057 9.63333 64.3391 10.58V17H63.3391V11.2C63.3391 9.86667 63.1391 8.89333 62.7391 8.28C62.3391 7.65333 61.7191 7.34 60.8791 7.34C60.0257 7.34 59.2657 7.64 58.5991 8.24C57.9457 8.82667 57.4791 9.6 57.1991 10.56V17H56.1991V6.6H57.1391V9.08C57.5791 8.22667 58.1457 7.57333 58.8391 7.12C59.5324 6.65333 60.2924 6.42 61.1191 6.42C61.9857 6.42 62.6924 6.68 63.2391 7.2C63.7991 7.70667 64.1324 8.38667 64.2391 9.24C64.7324 8.30667 65.3191 7.60667 65.9991 7.14C66.6791 6.66 67.4524 6.42 68.3191 6.42C68.8924 6.42 69.3724 6.52667 69.7591 6.74C70.1591 6.94 70.4857 7.24 70.7391 7.64C71.0057 8.02667 71.1924 8.50667 71.2991 9.08C71.4191 9.65333 71.4791 10.3 71.4791 11.02V17ZM80.3198 17.2C79.5865 17.2 78.9065 17.06 78.2798 16.78C77.6532 16.4867 77.1065 16.0933 76.6398 15.6C76.1865 15.0933 75.8265 14.5133 75.5598 13.86C75.3065 13.1933 75.1798 12.4933 75.1798 11.76C75.1798 10.7733 75.3998 9.88 75.8398 9.08C76.2798 8.28 76.8865 7.64 77.6598 7.16C78.4332 6.66667 79.2998 6.42 80.2598 6.42C81.2465 6.42 82.1198 6.66667 82.8798 7.16C83.6398 7.65333 84.2398 8.30667 84.6798 9.12C85.1332 9.92 85.3598 10.8 85.3598 11.76C85.3598 11.84 85.3598 11.92 85.3598 12C85.3598 12.08 85.3532 12.1467 85.3398 12.2H76.2198C76.2732 12.9867 76.4932 13.7 76.8798 14.34C77.2665 14.98 77.7598 15.4867 78.3598 15.86C78.9732 16.22 79.6398 16.4 80.3598 16.4C81.0798 16.4 81.7598 16.2133 82.3998 15.84C83.0398 15.4667 83.4865 14.9867 83.7398 14.4L84.6198 14.64C84.4198 15.1333 84.0998 15.5733 83.6598 15.96C83.2332 16.3467 82.7265 16.6533 82.1398 16.88C81.5665 17.0933 80.9598 17.2 80.3198 17.2ZM76.1798 11.42H84.3998C84.3465 10.6067 84.1332 9.88667 83.7598 9.26C83.3865 8.63333 82.8932 8.14 82.2798 7.78C81.6798 7.42 81.0132 7.24 80.2798 7.24C79.5465 7.24 78.8798 7.42 78.2798 7.78C77.6798 8.14 77.1932 8.63333 76.8198 9.26C76.4465 9.88667 76.2332 10.6067 76.1798 11.42ZM27.9677 37V22.8H34.4877C35.181 22.8 35.821 22.94 36.4077 23.22C36.9943 23.5 37.501 23.88 37.9277 24.36C38.3543 24.8267 38.681 25.3533 38.9077 25.94C39.1477 26.5267 39.2677 27.12 39.2677 27.72C39.2677 28.2667 39.1877 28.7933 39.0277 29.3C38.8677 29.8067 38.6343 30.2733 38.3277 30.7C38.021 31.1133 37.6543 31.4733 37.2277 31.78L40.2277 37H35.9477L33.4477 32.64H31.8677V37H27.9677ZM31.8677 29.24H34.3277C34.4877 29.24 34.641 29.18 34.7877 29.06C34.9343 28.94 35.0543 28.7667 35.1477 28.54C35.2543 28.3133 35.3077 28.04 35.3077 27.72C35.3077 27.3867 35.2477 27.1133 35.1277 26.9C35.021 26.6733 34.881 26.5 34.7077 26.38C34.5477 26.26 34.3877 26.2 34.2277 26.2H31.8677V29.24ZM47.5638 37.2C46.8304 37.2 46.1504 37.06 45.5238 36.78C44.9104 36.5 44.3771 36.1133 43.9238 35.62C43.4704 35.1133 43.1171 34.5333 42.8638 33.88C42.6104 33.2267 42.4838 32.54 42.4838 31.82C42.4838 31.0867 42.6104 30.4 42.8638 29.76C43.1171 29.1067 43.4704 28.5333 43.9238 28.04C44.3904 27.5333 44.9304 27.14 45.5438 26.86C46.1704 26.5667 46.8438 26.42 47.5638 26.42C48.2838 26.42 48.9504 26.5667 49.5638 26.86C50.1771 27.14 50.7171 27.5333 51.1838 28.04C51.6504 28.5333 52.0104 29.1067 52.2638 29.76C52.5171 30.4 52.6438 31.0867 52.6438 31.82C52.6438 32.54 52.5171 33.2267 52.2638 33.88C52.0104 34.5333 51.6504 35.1133 51.1838 35.62C50.7304 36.1133 50.1904 36.5 49.5638 36.78C48.9504 37.06 48.2838 37.2 47.5638 37.2ZM43.4838 31.86C43.4838 32.6733 43.6638 33.42 44.0238 34.1C44.3971 34.7667 44.8904 35.3 45.5038 35.7C46.1171 36.1 46.7971 36.3 47.5438 36.3C48.2904 36.3 48.9704 36.1 49.5838 35.7C50.2104 35.2867 50.7038 34.74 51.0638 34.06C51.4371 33.3667 51.6238 32.6133 51.6238 31.8C51.6238 30.9867 51.4371 30.24 51.0638 29.56C50.7038 28.88 50.2104 28.34 49.5838 27.94C48.9704 27.5267 48.2971 27.32 47.5638 27.32C46.8171 27.32 46.1371 27.5267 45.5238 27.94C44.9104 28.3533 44.4171 28.9 44.0438 29.58C43.6704 30.26 43.4838 31.02 43.4838 31.86ZM59.2686 37L54.9286 26.6H55.9886L59.8086 35.94L63.6486 26.6H64.6486L60.3086 37H59.2686ZM72.1034 37.2C71.3701 37.2 70.6901 37.06 70.0634 36.78C69.4368 36.4867 68.8901 36.0933 68.4234 35.6C67.9701 35.0933 67.6101 34.5133 67.3434 33.86C67.0901 33.1933 66.9634 32.4933 66.9634 31.76C66.9634 30.7733 67.1834 29.88 67.6234 29.08C68.0634 28.28 68.6701 27.64 69.4434 27.16C70.2168 26.6667 71.0834 26.42 72.0434 26.42C73.0301 26.42 73.9034 26.6667 74.6634 27.16C75.4234 27.6533 76.0234 28.3067 76.4634 29.12C76.9168 29.92 77.1434 30.8 77.1434 31.76C77.1434 31.84 77.1434 31.92 77.1434 32C77.1434 32.08 77.1368 32.1467 77.1234 32.2H68.0034C68.0568 32.9867 68.2768 33.7 68.6634 34.34C69.0501 34.98 69.5434 35.4867 70.1434 35.86C70.7568 36.22 71.4234 36.4 72.1434 36.4C72.8634 36.4 73.5434 36.2133 74.1834 35.84C74.8234 35.4667 75.2701 34.9867 75.5234 34.4L76.4034 34.64C76.2034 35.1333 75.8834 35.5733 75.4434 35.96C75.0168 36.3467 74.5101 36.6533 73.9234 36.88C73.3501 37.0933 72.7434 37.2 72.1034 37.2ZM67.9634 31.42H76.1834C76.1301 30.6067 75.9168 29.8867 75.5434 29.26C75.1701 28.6333 74.6768 28.14 74.0634 27.78C73.4634 27.42 72.7968 27.24 72.0634 27.24C71.3301 27.24 70.6634 27.42 70.0634 27.78C69.4634 28.14 68.9768 28.6333 68.6034 29.26C68.2301 29.8867 68.0168 30.6067 67.9634 31.42ZM85.6636 27.5C84.7303 27.5267 83.9103 27.8067 83.2036 28.34C82.5103 28.86 82.0236 29.58 81.7436 30.5V37H80.7436V26.6H81.7036V29.16C82.0636 28.4267 82.5436 27.8333 83.1436 27.38C83.7436 26.9133 84.3769 26.6467 85.0436 26.58C85.1769 26.5667 85.2969 26.56 85.4036 26.56C85.5103 26.56 85.5969 26.56 85.6636 26.56V27.5Z" fill="url(#paint0_linear_580_3774)"/>

              
          <g transform="translate(4, 24)">
            <rect x="0" y="0" width="18" height="18" rx="2" fill="white"/>
            <circle cx="9" cy="9" r="4"  opacity="0.8"/>
          </g>
              
          <defs>
            <linearGradient id="paint0_linear_580_3774" x1="66.2623" y1="11.4286" x2="99.6596" y2="21.1451" gradientUnits="userSpaceOnUse">
              <stop stopColor="white"/>
              <stop offset="1" stopColor="#757A8C" stopOpacity="0"/>
            </linearGradient>
          </defs>
            </svg>
          </div>
        </div>
        
        <div className="py-4 flex-1 overflow-y-auto">
          <ul className="space-y-2 px-2">
            {groups.map(group => (
              <li 
                key={group.id}
                className={`rounded-xl transition-all duration-300 ease-out cursor-pointer group relative 
                  ${activeGroup === group.id 
                    ? 'bg-gradient-to-r from-green-300/30 to-green-200/40 shadow-inner shadow-green-500/10 border border-green-500/20 translate-x-1' 
                    : 'hover:translate-y-[-2px] hover:translate-x-1 hover:rotate-1 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/20 hover:bg-gray-800/30'
                  }`}
                onClick={() => {
                  setActiveGroup(group.id);
                  setActiveTab(tabs[group.id][0].id);
                }}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <a className="flex items-center px-4 py-2.5 text-sm font-medium relative z-10">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 mr-3 transition-all duration-300 
                      ${activeGroup === group.id 
                        ? 'text-green-300 translate-z-2' 
                        : 'text-gray-400 group-hover:text-green-200 group-hover:translate-x-0.5 group-hover:translate-z-4'
                      }`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    style={{
                      transform: activeGroup === group.id ? 'translateZ(2px)' : '',
                    }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={group.icon} />
                  </svg>
                  <span 
                    className={`transition-all duration-300 
                      ${activeGroup === group.id 
                        ? 'text-white' 
                        : 'group-hover:translate-x-0.5 group-hover:text-white'
                      }`}
                    style={{
                      transform: activeGroup === group.id ? 'translateZ(1px)' : '',
                    }}
                  >
                    {group.name}
                  </span>
                </a>
                
                {/* 3D Layering effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/0 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                
                {/* Edge highlight glow */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" 
                  style={{
                    boxShadow: '0 0 0 1px rgba(74, 222, 128, 0.2), inset 0 0 0 1px rgba(74, 222, 128, 0.1)',
                    transform: 'translateZ(-1px)',
                  }}
                ></div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 text-xs text-center border-t border-gray-800/40 text-gray-500">
          © 2025, Made with ❤️ by CSE
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <div className="h-16 bg-gray-900/60 backdrop-blur-xl rounded-bl-2xl shadow-xl border-b border-gray-800/30 flex items-center justify-between px-6 transition-all duration-300 hover:bg-gray-900/70">
          <div className="flex items-center">
            <div className="text-sm">
              <span className="text-gray-400">{groups.find(g => g.id === activeGroup)?.name} / </span>
              <span className="text-white font-medium">{tabs[activeGroup]?.find(t => t.id === activeTab)?.name}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar with Dropdown Results */}
            <div ref={searchRef} className="dropdown-container relative">
              <input 
                type="search" 
                placeholder="Search for jobs, candidates..." 
                className="bg-gray-800/40 text-sm border border-gray-700/40 rounded-full px-4 py-1.5 w-52 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-transparent transition-all duration-300 hover:bg-gray-800/60 hover:w-64"
                onChange={(e) => {
                  console.log(`Searching for: ${e.target.value.toLowerCase()}`);
                }}
                onFocus={() => setShowSearchDropdown(true)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 absolute right-3 top-2 text-gray-400 hover:text-green-400 transition-colors duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            
            {/* Notes Button with Popup Modal */}
            <div ref={notesRef} className="dropdown-container">
              <button 
                onClick={() => setShowNotesModal(!showNotesModal)}
                className="bg-gradient-to-r from-green-500/90 to-teal-500/90 hover:from-green-600 hover:to-teal-600 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg backdrop-blur-sm border border-green-400/20 hover:border-green-400/40"
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
                  Take Notes
                </span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications Dropdown */}
              <div ref={notificationsRef} className="dropdown-container relative">
                <button 
                  className="relative flex items-center justify-center h-9 w-9 rounded-full bg-gray-800/40 hover:bg-gray-800/80 transition-all duration-300"
                  onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300 hover:text-white transition-colors" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full border-2 border-gray-900">3</span>
                </button>
              </div>
              
              {/* User Profile Dropdown */}
              <div ref={profileRef} className="dropdown-container relative">
                <div 
                  className="h-9 w-9 rounded-full bg-gradient-to-r from-purple-500/90 to-blue-500/90 flex items-center justify-center text-white text-sm font-bold cursor-pointer shadow-md transition-transform duration-300 hover:scale-110"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  HR
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="glass-panel">
          <div className="flex px-6">
            {activeGroup && tabs[activeGroup].map(tab => (
              <button 
                key={tab.id}
                className={`group px-4 py-3 text-sm focus:outline-none transition-colors relative ${
                  activeTab === tab.id 
                    ? 'text-green-300 font-medium' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.name}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400">
                    <span className="absolute inset-0 bg-green-300 transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
              
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6 glass-panel">
          {/* Dashboard */}
          {activeGroup === 'dashboard' && <div className="text-white">Dashboard Content</div>}
          {activeGroup === 'groupnone' && activeTab === 'job-role-panel' && <JobRolePanel />}
          
          {/* Group 9 Components */}
          {activeGroup === 'group9' && activeTab === 'resume-uploader' && <ResumeUploader />}
          {activeGroup === 'group9' && activeTab === 'nlp-results' && <NLPResults />}
          
          {/* Group 10 Components */}
          {activeGroup === 'group10' && activeTab === 'candidate-ranking' && <CandidateRanking />}
          {activeGroup === 'group10' && activeTab === 'fairness-metrics' && <FairnessMetrics />}
          
          {/* Group 11 Components */}
          {activeGroup === 'group11' && activeTab === 'document-status' && <DocumentStatus />}
          {activeGroup === 'group11' && activeTab === 'cv-details' && <CVDetails />}
          {activeGroup === 'group11' && activeTab === 'verification-form' && <VerificationForm />}
          
          {/* Group 12 Components */}
          {activeGroup === 'group12' && activeTab === 'analytics-dashboard' && <AnalyticsDashboard />}
          {activeGroup === 'group12' && activeTab === 'predictive-model' && <PredictiveModel />}
          {activeGroup === 'group12' && activeTab === 'job-roles-page' && <JobRolesPage />}
        </div>
      </div>

      {/* OVERLAY UI ELEMENTS - Placed at the end of the document to ensure they appear on top */}
      
      {/* Search Results Dropdown as Overlay */}
      {showSearchDropdown && (
        <>
          <div className="modal-overlay" onClick={() => setShowSearchDropdown(false)}></div>
          <div 
            className="overlay-panel p-4 w-80 max-w-lg"
            style={getOverlayPosition(searchRef)}
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="text-xs text-gray-400 py-1 px-2">Quick Results</div>
            <div className="hover:bg-gray-800/60 px-3 py-2 rounded-lg cursor-pointer transition-colors">
              <div className="text-white text-sm">Software Engineer</div>
              <div className="text-gray-400 text-xs">Job Role • Engineering</div>
            </div>
            <div className="hover:bg-gray-800/60 px-3 py-2 rounded-lg cursor-pointer transition-colors">
              <div className="text-white text-sm">Data Scientist</div>
              <div className="text-gray-400 text-xs">Job Role • Data</div>
            </div>
            <div className="text-center text-green-400 text-xs py-1 mt-1 cursor-pointer hover:text-green-300">
              View all results
            </div>
          </div>
        </>
      )}
      
      {/* Notes Modal Overlay */}
      {showNotesModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowNotesModal(false)}></div>
          <div className="fixed inset-0 flex items-center justify-center z-[9999]" onClick={(e) => e.stopPropagation()}>
            <div className="overlay-panel p-6 w-96 max-w-[90vw] max-h-[80vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium text-lg">Quick Notes</h3>
                <button 
                  onClick={() => setShowNotesModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <textarea 
                className="w-full h-40 bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-transparent resize-none text-sm"
                placeholder="Write your notes here..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              ></textarea>
              <button 
                className="mt-4 bg-green-600/90 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full"
                onClick={() => {
                  console.log("Saving note:", noteText);
                  setShowNotesModal(false);
                }}
              >
                Save Note
              </button>
            </div>
          </div>
        </>
      )}
      
      {/* Notifications Dropdown Overlay */}
      {showNotificationsDropdown && (
        <>
          <div className="modal-overlay" onClick={() => setShowNotificationsDropdown(false)}></div>
          <div 
            className="overlay-panel p-4 w-80 max-h-[80vh] overflow-auto" 
            style={getOverlayPosition(notificationsRef)}
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="flex justify-between items-center px-3 py-2">
              <h3 className="text-white font-medium text-sm">Notifications</h3>
              <span className="text-xs text-green-400 cursor-pointer hover:text-green-300">Mark all as read</span>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="hover:bg-gray-800/60 p-3 rounded-lg cursor-pointer transition-colors border-l-2 border-blue-500">
                <div className="flex">
                  <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white text-sm">New candidate application</div>
                    <div className="text-gray-400 text-xs">John Smith applied for Software Engineer</div>
                    <div className="text-gray-500 text-xs mt-1">5 minutes ago</div>
                  </div>
                </div>
              </div>
              
              <div className="hover:bg-gray-800/60 p-3 rounded-lg cursor-pointer transition-colors border-l-2 border-green-500">
                <div className="flex">
                  <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white text-sm">Resume matching complete</div>
                    <div className="text-gray-400 text-xs">15 candidates matched for Data Analyst</div>
                    <div className="text-gray-500 text-xs mt-1">1 hour ago</div>
                  </div>
                </div>
              </div>
              
              <div className="hover:bg-gray-800/60 p-3 rounded-lg cursor-pointer transition-colors border-l-2 border-yellow-500">
                <div className="flex">
                  <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white text-sm">System alert</div>
                    <div className="text-gray-400 text-xs">Daily analysis reports are ready</div>
                    <div className="text-gray-500 text-xs mt-1">2 hours ago</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center text-green-400 text-xs py-2 mt-1 cursor-pointer hover:text-green-300 border-t border-gray-800/50">
              View all notifications
            </div>
          </div>
        </>
      )}
      
      {/* Profile Dropdown Overlay */}
      {showProfileDropdown && (
        <>
          <div className="modal-overlay" onClick={() => setShowProfileDropdown(false)}></div>
          <div 
            className="overlay-panel p-4 w-60" 
            style={getOverlayPosition(profileRef)}
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="flex items-center px-3 py-2 border-b border-gray-800/50">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500/90 to-blue-500/90 flex items-center justify-center text-white text-sm font-bold mr-3">
                {userData.avatar ? (
                  <img src={userData.avatar} alt="User Avatar" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  userData.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <div className="text-white font-medium">{userData.name}</div>
                <div className="text-gray-400 text-xs">{userData.role}</div>
              </div>
            </div>
            
            <div className="py-1">
              <button 
                onClick={() => {
                  setShowProfileModal(true);
                  setShowProfileDropdown(false);
                }}
                className="flex items-center w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800/60 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                My Profile
              </button>
              <button 
                onClick={() => {
                  setShowSettingsModal(true);
                  setShowProfileDropdown(false);
                }}
                className="flex items-center w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800/60 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Settings
              </button>
              <div className="border-t border-gray-800/50 my-1"></div>
              <button 
                onClick={handleLogout}
                className="flex items-center w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* Profile Modal Overlay */}
      {showProfileModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowProfileModal(false)}></div>
          <div 
            className="fixed inset-0 flex items-center justify-center z-[9999]" 
            onClick={(e) => e.stopPropagation()}
          >
            <div ref={profileModalRef} className="overlay-panel p-6 w-[480px] max-w-[90vw] max-h-[80vh] overflow-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-medium text-xl">My Profile</h3>
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-col items-center mb-6">
                <div className="h-24 w-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-4 border-4 border-gray-800">
                  {userData.avatar ? (
                    <img src={userData.avatar} alt="User Avatar" className="h-24 w-24 rounded-full object-cover" />
                  ) : (
                    userData.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                  )}
                </div>
                <h2 className="text-white text-xl font-semibold">{userData.name}</h2>
                <p className="text-gray-400">{userData.role}</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <h4 className="text-gray-400 text-sm mb-2">Email Address</h4>
                  <p className="text-white">{userData.email}</p>
                </div>
                
                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <h4 className="text-gray-400 text-sm mb-2">Account Information</h4>
                  <div className="flex justify-between text-white">
                    <span>Account Type:</span>
                    <span className="font-medium">Administrator</span>
                  </div>
                  <div className="flex justify-between text-white mt-2">
                    <span>Last Login:</span>
                    <span className="font-medium">Today at {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button 
                    onClick={() => setShowProfileModal(false)} 
                    className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                  <button 
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Settings Modal Overlay */}
      {showSettingsModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}></div>
          <div 
            className="fixed inset-0 flex items-center justify-center z-[9999]" 
            onClick={(e) => e.stopPropagation()}
          >
            <div ref={settingsModalRef} className="overlay-panel p-6 w-[480px] max-w-[90vw] max-h-[80vh] overflow-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-medium text-xl">Settings</h3>
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-medium mb-3">Interface Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <h5 className="text-white">Dark Mode</h5>
                        <p className="text-gray-400 text-sm">Toggle between light and dark theme</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <h5 className="text-white">Notifications</h5>
                        <p className="text-gray-400 text-sm">Enable push notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-3">Security Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <h5 className="text-white">Two-Factor Authentication</h5>
                        <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    
                    <button className="w-full p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-left transition-colors">
                      <h5 className="text-white flex items-center">
                        <span>Change Password</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </h5>
                      <p className="text-gray-400 text-sm">Update your password regularly</p>
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button 
                    onClick={() => setShowSettingsModal(false)} 
                    className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      // Save settings logic here
                      setShowSettingsModal(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Logout Animation Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-gray-900/90 backdrop-blur-md">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
            <h2 className="text-xl font-medium text-white mb-2">Logging Out...</h2>
            <p className="text-gray-400">Please wait while we securely log you out</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component with Routing
function App() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate checking authentication status
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/Resume_Rover_Main/login" element={<Login />} />
      <Route 
        path="/Resume_Rover_Main/admin" 
        element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } 
      />
      <Route path="/Resume_Rover_Main" element={<Navigate to="/Resume_Rover_Main/login" replace />} />
      <Route path="/" element={<Navigate to="/Resume_Rover_Main/login" replace />} />
    </Routes>
  );
}

export default App;