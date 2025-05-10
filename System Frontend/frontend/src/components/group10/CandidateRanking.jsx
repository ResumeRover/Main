import { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9000",
});

const CandidateRanking = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobList, setJobList] = useState([]);
  const [jobPosition, setJobPosition] = useState("");
  const [error, setError] = useState(null);

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

  return (
    <div className="p-6 bg-gray-900 rounded-lg text-white">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">AI Candidate Ranking</h2>
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
                    {getStatusBadge(candidate.is_verified)}
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
                  <td className="px-6 py-4 text-sm">
                    <button className="text-blue-400 hover:text-blue-300 mr-3">
                      View
                    </button>
                    <button className="text-green-400 hover:text-green-300">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CandidateRanking;
