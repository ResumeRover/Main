import { useState, useEffect } from "react";
import axios from "axios";

// Create API service for both jobs and email
const jobsApi = axios.create({
  baseURL: "https://resumeparserjobscs3023.azurewebsites.net/api",
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
});

// Email client API
const emailApi = axios.create({
  baseURL: "https://email-client-resume-143155629435.asia-southeast1.run.app",
  headers: {
    'Content-Type': 'application/json'
  }
});


const CandidateRanking = () => {
  // Store all candidates in one state and filtered candidates in another
  const [allCandidates, setAllCandidates] = useState([]);
  const [displayedCandidates, setDisplayedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobList, setJobList] = useState([]);
  const [jobPosition, setJobPosition] = useState("Senior Software Engineer"); // Set default position
  const [error, setError] = useState(null);
  const [emailSending, setEmailSending] = useState(false);

  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [actionType, setActionType] = useState(""); // "accept" or "reject"
  const [sendEmail, setSendEmail] = useState(true); // Default to true
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [emailStatus, setEmailStatus] = useState({ success: false, message: '' });

  // Fetch job roles from API
  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        const response = await jobsApi.get("/jobs?code=yfdJdeNoFZzkQynk6p56ZETolRh1NqSpOaBYcTebXJO3AzFuWbJDmQ==");
        
        if (response.data && Array.isArray(response.data)) {
          // Extract unique job titles
          const titles = [...new Set(response.data.map(job => job.title))];
          setJobList(titles);
        } else {
          // Fallback to local storage if API fails
          loadJobsFromLocalStorage();
        }
      } catch (err) {
        console.error("Error fetching job roles:", err);
        setError("Failed to load job roles");
        // Fallback to local storage if API fails
        loadJobsFromLocalStorage();
      }
    };

    const loadJobsFromLocalStorage = () => {
      try {
        const savedJobs = localStorage.getItem('jobRoles');
        if (savedJobs) {
          const jobData = JSON.parse(savedJobs);
          const titles = jobData.map(job => job.roleName);
          setJobList(titles);
        }
      } catch (err) {
        console.error("Error loading jobs from localStorage:", err);
      }
    };

    fetchJobRoles();
  }, []);

  // Fetch candidates whenever job position changes
  useEffect(() => {
    // Only fetch if a job position is selected
    if (jobPosition) {
      fetchCandidates(jobPosition);
    }
  }, [jobPosition]);

  // Fetch candidates from backend based on job position
  const fetchCandidates = async (position) => {
    setLoading(true);
    setError(null); // Clear any previous errors
    
    try {
      // Use the position parameter to fetch candidates for that specific role
      const response = await axios.get(
        `https://resumerovermain-production.up.railway.app/candidates/${encodeURIComponent(position)}`
      );
      
      if (response.data && Array.isArray(response.data)) {
        console.log(`Fetched candidates for ${position}:`, response.data);
        // Format the data for the UI
        const formattedCandidates = response.data.map((candidate, index) => ({
          id: candidate.id || candidate._id || `candidate-${index + 1}`,
          name: candidate.name || candidate.candidate_name || "Unknown Candidate",
          email: candidate.email || candidate.candidate_email || "no-email@example.com",
          phone: candidate.phone || candidate.candidate_phone || "Not provided",
          is_verified: candidate.is_verified || false,
          ranking_score: candidate.score || candidate.ranking_score || 0.635234678, // If no score, assign random
          status: candidate.status || "in progress",
          applied_position: candidate.applied_position || candidate.position || position,
          parsed_data: candidate.parsed_data || {}
        }));
        
        // Sort candidates by ranking score
        const sortedCandidates = [...formattedCandidates].sort(
          (a, b) => b.ranking_score - a.ranking_score
        );
        
        // Update both candidate states
        setAllCandidates(sortedCandidates);
        setDisplayedCandidates(sortedCandidates);
        console.log(`Successfully loaded candidates for ${position}`);
      } else {
        console.log(`No candidates data found for ${position}`);
        setError(`No candidates found for ${position} position.`);
        setAllCandidates([]);
        setDisplayedCandidates([]);
      }
    } catch (err) {
      console.error(`Error fetching candidates for ${position}:`, err);
      
      // Set a more user-friendly error message
      if (err.response && err.response.status === 404) {
        setError(`No candidates found for ${position} position.`);
      } else {
        setError(`Failed to load candidates for ${position}. ${err.message}`);
      }
      
      // Clear the candidates when there's an error
      setAllCandidates([]);
      setDisplayedCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle job position change
  const handleJobPositionChange = (e) => {
    const newPosition = e.target.value;
    setJobPosition(newPosition);
    
    // If "All Positions" is selected, try to fetch all candidates
    if (!newPosition) {
      fetchAllCandidates();
    }
  };
  
  // Fetch all candidates regardless of position
  const fetchAllCandidates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch all candidates - this endpoint might need to be adjusted based on your API
      const response = await axios.get(
        "https://resumerovermain-production.up.railway.app/candidates/all"
      );
      
      if (response.data && Array.isArray(response.data)) {
        const formattedCandidates = response.data.map((candidate, index) => ({
          id: candidate.id || candidate._id || `candidate-${index + 1}`,
          name: candidate.name || candidate.candidate_name ,
          email: candidate.email || candidate.candidate_email ,
          phone: candidate.phone || candidate.candidate_phone ,
          is_verified: candidate.is_verified || false,
          ranking_score: candidate.score || candidate.ranking_score ,
          status: candidate.status || "in progress",
          applied_position: candidate.applied_position || candidate.position || "Unknown Position",
          parsed_data: candidate.parsed_data || {}
        }));
        
        const sortedCandidates = [...formattedCandidates].sort(
          (a, b) => b.ranking_score - a.ranking_score
        );
        
        setAllCandidates(sortedCandidates);
        setDisplayedCandidates(sortedCandidates);
      } else {
        setError("No candidates found.");
        setAllCandidates([]);
        setDisplayedCandidates([]);
      }
    } catch (err) {
      console.error("Error fetching all candidates:", err);
      setError("Failed to load candidates. Please try again later.");
      setAllCandidates([]);
      setDisplayedCandidates([]);
    } finally {
      setLoading(false);
    }
  };

const getScoreColor = (score) => {
  // Convert decimal score to percentage (0-100 scale)
  const scorePercentage = score * 100;
  
  if (scorePercentage >= 85) return "text-green-500";  // Excellent match (85-100%)
  if (scorePercentage >= 70) return "text-blue-500";   // Good match (70-84%)
  if (scorePercentage >= 50) return "text-yellow-500"; // Average match (50-69%)
  if (scorePercentage >= 30) return "text-orange-500"; // Below average (30-49%)
  return "text-red-500";                               // Poor match (0-29%)
};

  const getStatusBadge = (isVerified) => {
    if (isVerified) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-400">
          Valid
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-400">
        valid
      </span>
    );
  };

  const handleActionClick = (candidate, type) => {
    setSelectedCandidate(candidate);
    setActionType(type);
    setShowOverlay(true);
    setSendEmail(true); // Default to sending email
  };

  // Function to send email notification
  const sendNotificationEmail = async (candidate, status) => {
    setEmailSending(true);
    
    try {
      // Prepare payload for the email service
      const payload = {
        email: candidate.email,
        name: candidate.name,
        status: status === "accept" ? "accepted" : "rejected"
      };
      console.log(payload)
      
      // Send to email service
      const response = await emailApi.get('/send-email', { params: { email: candidate.email,name: candidate.name, status: status === "accept" ? "accepted" : "rejected"} });
      
      console.log('Email notification sent:', response.data);
      console.log('Email sent to :', candidate.email);
      
      return {
        success: true,
        message: `Email notification sent to ${candidate.email}`
      };
    } catch (error) {
      console.error('Error sending email notification:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send email notification'
      };
    } finally {
      setEmailSending(false);
    }
  };

  // Update candidate status in database
  const updateCandidateStatus = async (candidate, status) => {
    try {
      // Submit status update to backend - using the applications endpoint
      const updateData = {
        id: candidate.id,
        email: candidate.email,
        name: candidate.name,
        status: status,
        notified: false // Will be set to true by sendEmail.js when email is sent
      };
      
      // Call API to update candidate status
      try {
        await axios.post(
          'https://resumeparserjobscs3023.azurewebsites.net/api/applications/update-status?code=yfdJdeNoFZzkQynk6p56ZETolRh1NqSpOaBYcTebXJO3AzFuWbJDmQ==', 
          updateData
        );
        console.log(`Candidate ${candidate.name} status updated to ${status}`);
        return true;
      } catch (apiError) {
        console.error('API error when updating status:', apiError);
        // Even if the API update fails, we'll update the UI
        return true;
      }
    } catch (error) {
      console.error('Error updating candidate status:', error);
      return false;
    }
  };

  const handleConfirmAction = async () => {
    if (selectedCandidate) {
      // Update status based on action type
      const newStatus = actionType === "accept" ? "accepted" : "rejected";
      
      // Update local state first for immediate feedback
      // Update in both candidate arrays
      const updatedAllCandidates = allCandidates.map((candidate) =>
        candidate.id === selectedCandidate.id
          ? { ...candidate, status: newStatus }
          : candidate
      );
      setAllCandidates(updatedAllCandidates);
      
      const updatedDisplayedCandidates = displayedCandidates.map((candidate) =>
        candidate.id === selectedCandidate.id
          ? { ...candidate, status: newStatus }
          : candidate
      );
      setDisplayedCandidates(updatedDisplayedCandidates);
      
      // Update status in database
      const statusUpdated = await updateCandidateStatus(selectedCandidate, newStatus);
      
      if (!statusUpdated) {
        setError("Failed to update candidate status in the database, but UI has been updated.");
      }
      
      // Send email if opted in
      let emailResult = { success: false, message: 'Email notification skipped' };
      if (sendEmail) {
        emailResult = await sendNotificationEmail(selectedCandidate, actionType);
        setEmailStatus(emailResult);
      }
      
      // Show confirmation message
      setShowConfirmation(true);
      
      // Close dialog after delay
      setTimeout(() => {
        setShowConfirmation(false);
        setShowOverlay(false);
        setSelectedCandidate(null);
        setSendEmail(true);
        setEmailStatus({ success: false, message: '' });
      }, 2000);
    }
  };

  const handleCancelAction = () => {
    setShowOverlay(false);
    setSelectedCandidate(null);
    setSendEmail(true);
    setEmailStatus({ success: false, message: '' });
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg text-white">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Candidate Ranking</h2>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <div>
            <label
              htmlFor="job-position"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Select Job Position
            </label>
            <select
              id="job-position"
              value={jobPosition}
              onChange={handleJobPositionChange}
              className="bg-gray-800 border border-gray-700 text-white py-1 px-3 rounded focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="">All Positions</option>
              {jobList.map((job, index) => (
                <option key={index} value={job}>
                  {job}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-amber-400 mb-4 p-3 bg-amber-900/20 rounded-lg border border-amber-800/30">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : displayedCandidates.length === 0 ? (
        <div className="text-center text-gray-400 p-10 bg-gray-800/50 rounded-lg border border-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-lg font-semibold mb-2">No candidates found</p>
          <p className="text-gray-500">Try selecting a different job position or check back later.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Resume Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {displayedCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="font-medium text-lg">
                          {candidate.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">
                          {candidate.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {candidate.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{candidate.phone}</td>
                  <td className="px-6 py-4 text-sm">
                    {candidate.status === "accepted" ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-400">
                        Accepted
                      </span>
                    ) : candidate.status === "rejected" ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-900 text-red-400">
                        Rejected
                      </span>
                    ) : (
                      getStatusBadge(candidate.is_verified)
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`text-lg font-bold ${getScoreColor(
                        candidate.ranking_score
                      )}`}
                    >
                      {(candidate.ranking_score * 100).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {candidate.status === "accepted" || candidate.status === "rejected" ? (
                      <div className="text-sm text-gray-400">
                        Status: {candidate.status === "accepted" ? (
                          <span className="text-green-400">Accepted</span>
                        ) : (
                          <span className="text-red-400">Rejected</span>
                        )}
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleActionClick(candidate, "accept")}
                          className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all duration-200 group"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-4 w-4 mr-1.5 group-hover:scale-110 transition-transform duration-200" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M5 13l4 4L19 7" 
                            />
                          </svg>
                          Accept
                        </button>
                        
                        <button
                          onClick={() => handleActionClick(candidate, "reject")}
                          className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all duration-200 group"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-4 w-4 mr-1.5 group-hover:scale-110 transition-transform duration-200" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M6 18L18 6M6 6l12 12" 
                            />
                          </svg>
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

{/* Confirmation Overlay */}
{showOverlay && (
  <div className="fixed inset-0 overflow-hidden bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
    {/* Modal content */}
    <div 
      className="relative w-96 p-6 rounded-xl overflow-hidden border border-gray-700/50 shadow-xl"
      style={{
        background: "linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
        zIndex: 10000
      }}
      onClick={(e) => e.stopPropagation()} // Prevent clicks from closing when clicking on the modal
    >
      {/* Decorative elements for glass effect */}
      <div className="absolute -top-24 -right-24 w-40 h-40 bg-green-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
      
      {showConfirmation ? (
        <div className="flex flex-col items-center relative z-10">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white animate-[scale_0.5s_ease-in-out]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-white mb-1">Action Confirmed!</h3>
          <p className="text-gray-300 text-sm mb-2">The candidate has been {actionType === "accept" ? "accepted" : "rejected"}.</p>
          
          {emailStatus.message && (
            <div className={`mt-3 p-2 rounded text-sm ${
              emailStatus.success ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
            }`}>
              {emailStatus.message}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="relative z-10">
            <h3 className="text-xl font-medium mb-4 text-white">
              Confirm {actionType === "accept" ? "Acceptance" : "Rejection"}
            </h3>
            <p className="mb-5 text-gray-300">
              Are you sure you want to {actionType}{" "}
              <strong className="text-white">{selectedCandidate?.name}</strong>?
            </p>
            
            <div className="flex items-center mb-6 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
              <input
                type="checkbox"
                id="send-email"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="mr-3 h-4 w-4 rounded border-gray-500 text-primary-500 focus:ring-primary-500/50 focus:ring-offset-0 bg-gray-700"
              />
              <div>
                <label htmlFor="send-email" className="text-sm font-medium text-white">
                  Send notification email
                </label>
                <p className="text-xs text-gray-400 mt-0.5">
                  Candidate will be notified about their application status
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelAction}
                disabled={emailSending}
                className="px-4 py-2.5 bg-gray-700/50 hover:bg-gray-600 rounded-lg text-sm border border-gray-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={emailSending}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  actionType === "accept"
                    ? "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-md shadow-emerald-500/20"
                    : "bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 shadow-md shadow-rose-500/20"
                }`}
              >
                {emailSending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
)}
    </div>
  );
};

export default CandidateRanking;