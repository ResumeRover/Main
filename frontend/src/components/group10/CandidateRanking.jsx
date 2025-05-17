import { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "https://main-production-7511.up.railway.app/", 
});


const CandidateRanking = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobList, setJobList] = useState([]);
  const [jobPosition, setJobPosition] = useState("");
  const [error, setError] = useState(null);

  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [actionType, setActionType] = useState(""); // "accept" or "reject"
  const [sendEmail, setSendEmail] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); // For confirmation tick animation

  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        const response = await api.get("/jobs/titles");
        const titles = response.data.titles;
        setJobList(titles);
      } catch (err) {
        console.error("Error fetching job roles:", err);
        setError("Failed to load job roles");
      } finally {
        setLoading(false);
      }
    };

    fetchJobRoles();
  }, 
  
  []);

   // Mock data for testing
   useEffect(() => {
    const mockCandidates = [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
        is_verified: true,
        ranking_score: 85,
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "987-654-3210",
        is_verified: false,
        ranking_score: 78,
      },
      {
        id: 3,
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        phone: "555-123-4567",
        is_verified: true,
        ranking_score: 92,
      },
      {
        id: 4,
        name: "Bob Brown",
        email: "bob.brown@example.com",
        phone: "444-555-6666",
        is_verified: false,
        ranking_score: 65,
      },
    ];

    setCandidates(mockCandidates);
    setLoading(false);
  }, []);

  const fetchCandidates = async (role) => {
    setLoading(true);
    try {
      const response = await api.get(`/candidates/${encodeURIComponent(role)}`);
      // Sort candidates by ranking_score in descending order
      const sortedCandidates = response.data.sort(
        (a, b) => b.ranking_score - a.ranking_score
      );
      setCandidates(sortedCandidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError(error.response?.data?.detail || "Failed to load candidates");
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobPosition) {
      fetchCandidates(jobPosition);
    }
  }, [jobPosition]);
  const getScoreColor = (score) => {
    if (score >= 85) return "text-green-500";
    if (score >= 75) return "text-blue-500";
    if (score >= 65) return "text-yellow-500";
    return "text-red-500";
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
      <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
        Pending
      </span>
    );
  };

  //New Stuff by pvnzki

    const handleActionClick = (candidate, type) => {
      setSelectedCandidate(candidate);
      setActionType(type);
      setShowOverlay(true);
    };
  
    const handleConfirmAction = () => {
      if (selectedCandidate) {
        const updatedCandidates = candidates.map((candidate) =>
          candidate.email === selectedCandidate.email
            ? { ...candidate, status: actionType === "accept" ? "Accepted" : "Rejected" }
            : candidate
        );
        setCandidates(updatedCandidates);
  
        if (sendEmail) {
          console.log(
            `Email sent to ${selectedCandidate.email}: ${
              actionType === "accept" ? "Accepted" : "Rejected"
            }`
          );
        }
  
        setShowConfirmation(true);
        setTimeout(() => {
          setShowConfirmation(false);
          setShowOverlay(false);
          setSelectedCandidate(null);
          setSendEmail(false);
        }, 2000); 
      }
    };
  
    const handleCancelAction = () => {
      setShowOverlay(false);
      setSelectedCandidate(null);
      setSendEmail(false);
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
              onChange={(e) => setJobPosition(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white py-1 px-3 rounded focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="" disabled hidden>
                -- Select Job Position --
              </option>
              {jobList.map((job, index) => (
                <option key={index} value={job}>
                  {job}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center text-gray-400">
          No candidates found for this job position
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
              {candidates.map((candidate, index) => (
                <tr key={index} className="hover:bg-gray-700/50">
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
                    {getStatusBadge(true)}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`text-lg font-bold ${getScoreColor(
                        candidate.ranking_score
                      )}`}
                    >
                      {candidate.ranking_score}%
                    </div>
                  </td>
                  {/* // New Stuff by pvnzki - accept reject buttons */}
                  <td className="px-6 py-4 text-sm">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* //new Stuff by pvnzki */}
      {/* Overlay for Confirmation */}
      {showOverlay && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div 
      className="relative w-96 p-6 rounded-xl overflow-hidden border border-gray-700/50 shadow-xl"
      style={{
        background: "linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset"
      }}
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
          <p className="text-gray-300 text-sm">The candidate has been {actionType === "accept" ? "accepted" : "rejected"}.</p>
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
                className="px-4 py-2.5 bg-gray-700/50 hover:bg-gray-600 rounded-lg text-sm border border-gray-600/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                  actionType === "accept"
                    ? "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-md shadow-emerald-500/20"
                    : "bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 shadow-md shadow-rose-500/20"
                }`}
              >
                Confirm
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
