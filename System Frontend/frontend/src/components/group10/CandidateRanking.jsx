import { useState, useEffect } from 'react';
import { getCandidateRankings } from '../../services/api';

const CandidateRanking = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobPosition, setJobPosition] = useState('Software Engineer');
  const [sortBy, setSortBy] = useState('score');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample data for demonstration
  const mockCandidates = [
    {
      id: '000010',
      name: 'Queen Pluml',
      email: 'queen@pluml.com',
      education: 'CS Undergraduate, University of Moratuwa',
      score: 92,
      status: 'Valid',
      skillMatch: 87,
      experienceMatch: 82,
      decisionPath: [
        'Education: CS Degree (+30)',
        'Top Skills: ML, Python, Data Analysis (+25)',
        'Experience: 1-3 years (+15)',
        'Keywords: algorithm, data structures (+12)',
        'Projects: 3 relevant (+10)'
      ]
    },
    {
      id: '00003A',
      name: 'Since Johny',
      email: 'johny@since.com',
      education: 'CS Undergraduate, University of Colombo',
      score: 88,
      status: 'Valid',
      skillMatch: 92,
      experienceMatch: 75,
      decisionPath: [
        'Education: CS Degree (+30)',
        'Top Skills: React, Node.js, MongoDB (+22)',
        'Experience: 1-2 years (+12)',
        'Keywords: fullstack, web development (+14)',
        'Projects: 4 relevant (+10)'
      ]
    },
    {
      id: '00004F',
      name: 'Buri Santoso',
      email: 'owner@buri.com',
      education: 'SE Undergraduate, SLIIT',
      score: 84,
      status: 'Valid',
      skillMatch: 80,
      experienceMatch: 79,
      decisionPath: [
        'Education: SE Degree (+28)',
        'Top Skills: Java, Spring, Microservices (+20)',
        'Experience: 1-2 years (+12)',
        'Keywords: backend, API (+14)',
        'Projects: 3 relevant (+10)'
      ]
    },
    {
      id: '00002C',
      name: 'Thanudi',
      email: 'thanudi@outlook.com',
      education: 'IT Undergraduate, University of Moratuwa',
      score: 76,
      status: 'Pending',
      skillMatch: 75,
      experienceMatch: 68,
      decisionPath: [
        'Education: IT Degree (+25)',
        'Top Skills: UX/UI, Design, Frontend (+18)',
        'Experience: 0-1 years (+8)',
        'Keywords: user interface, wireframing (+15)',
        'Projects: 2 relevant (+10)'
      ]
    },
    {
      id: '0000BH',
      name: 'Dan Piyasad',
      email: 'dan@piyasad.com',
      education: 'SE Undergraduate, IIT',
      score: 72,
      status: 'Pending',
      skillMatch: 69,
      experienceMatch: 65,
      decisionPath: [
        'Education: SE Degree (+28)',
        'Top Skills: PHP, Laravel, MySQL (+15)',
        'Experience: 0-1 years (+8)',
        'Keywords: database, backend (+11)',
        'Projects: 2 relevant (+10)'
      ]
    },
    {
      id: '00007J',
      name: 'Mark Suckerberg',
      email: 'mark@example.com',
      education: 'SE Undergraduate, NSBM',
      score: 68,
      status: 'Pending',
      skillMatch: 65,
      experienceMatch: 60,
      decisionPath: [
        'Education: SE Degree (+28)',
        'Top Skills: .NET, C#, SQL Server (+15)',
        'Experience: 0-1 years (+8)',
        'Keywords: enterprise, windows (+7)',
        'Projects: 1 relevant (+10)'
      ]
    }
  ];

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        // In a real app, you would call the API
        // const data = await getCandidateRankings(jobPosition);
        // setCandidates(data);
        
        // Using mock data for demonstration
        setTimeout(() => {
          let filteredCandidates = [...mockCandidates];
          
          // Apply status filter
          if (filterStatus !== 'all') {
            filteredCandidates = filteredCandidates.filter(c => c.status === filterStatus);
          }
          
          // Apply sorting
          filteredCandidates.sort((a, b) => {
            if (sortBy === 'score') return b.score - a.score;
            if (sortBy === 'skillMatch') return b.skillMatch - a.skillMatch;
            if (sortBy === 'experienceMatch') return b.experienceMatch - a.experienceMatch;
            return 0;
          });
          
          setCandidates(filteredCandidates);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Failed to fetch candidates:', err);
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [jobPosition, sortBy, filterStatus]);

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 75) return 'text-blue-500';
    if (score >= 65) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusBadge = (status) => {
    if (status === 'Valid') {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-400">Valid</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">Pending</span>;
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg text-white">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">AI Candidate Ranking</h2>
        
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <div>
            <label htmlFor="job-position" className="block text-sm font-medium text-gray-400 mb-1">Job Position</label>
            <select
              id="job-position"
              value={jobPosition}
              onChange={(e) => setJobPosition(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white py-1 px-3 rounded focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="Software Engineer">Software Engineer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="UX Designer">UX Designer</option>
              <option value="Product Manager">Product Manager</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="sort-by" className="block text-sm font-medium text-gray-400 mb-1">Sort By</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white py-1 px-3 rounded focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="score">Overall Score</option>
              <option value="skillMatch">Skill Match</option>
              <option value="experienceMatch">Experience Match</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="filter-status" className="block text-sm font-medium text-gray-400 mb-1">Status</label>
            <select
              id="filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white py-1 px-3 rounded focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="all">All</option>
              <option value="Valid">Valid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Education</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Overall Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Skill Match
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Experience Match
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="font-medium text-lg">{candidate.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">{candidate.name}</div>
                        <div className="text-sm text-gray-400">{candidate.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{candidate.education}</td>
                  <td className="px-6 py-4 text-sm">{getStatusBadge(candidate.status)}</td>
                  <td className="px-6 py-4">
                    <div className={`text-lg font-bold ${getScoreColor(candidate.score)}`}>
                      {candidate.score}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${candidate.skillMatch}%` }}
                      ></div>
                    </div>
                    <div className="text-xs mt-1 text-center">{candidate.skillMatch}%</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${candidate.experienceMatch}%` }}
                      ></div>
                    </div>
                    <div className="text-xs mt-1 text-center">{candidate.experienceMatch}%</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-blue-400 hover:text-blue-300 mr-3">View</button>
                    <button className="text-green-400 hover:text-green-300">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Decision Path Section */}
      {candidates.length > 0 && (
        <div className="mt-8 bg-gray-800 p-5 rounded-lg">
          <h3 className="text-xl font-medium mb-4">Decision Path for Top Candidate</h3>
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 h-12 w-12 bg-blue-900 rounded-full flex items-center justify-center mr-4">
              <span className="font-medium text-lg">{candidates[0].name.charAt(0)}</span>
            </div>
            <div>
              <div className="text-lg font-medium">{candidates[0].name}</div>
              <div className="text-sm text-gray-400">{candidates[0].email}</div>
            </div> 
          </div>
          <div className="space-y-2">
            {candidates[0].decisionPath.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="h-4 w-4 bg-blue-500 rounded-full mr-3"></div>
                <div className="text-sm text-gray-300">{step}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateRanking; // Ensure this is exporting as default
