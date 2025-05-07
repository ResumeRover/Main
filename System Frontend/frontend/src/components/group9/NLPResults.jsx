import { useState, useEffect } from 'react';
import { getResumeAnalysis } from '../../services/api';

const NLPResults = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState('000010'); // Default to first candidate

  // Mock data - in a real app this would come from API
  const candidates = [
    { id: '000010', name: 'Queen Pluml' },
    { id: '00002C', name: 'Thanudi' },
    { id: '00003A', name: 'Since Johny' },
    { id: '00004F', name: 'Buri Santoso' }
  ];

  // Sample NLP analysis data (would come from API)
  const mockAnalysisData = {
    '000010': {
      skills: [
        { name: 'Python', confidence: 0.95, count: 8 },
        { name: 'Data Analysis', confidence: 0.89, count: 6 },
        { name: 'Machine Learning', confidence: 0.82, count: 4 },
        { name: 'SQL', confidence: 0.78, count: 3 },
        { name: 'TensorFlow', confidence: 0.71, count: 2 }
      ],
      education: [
        { degree: 'CS Undergraduate', institution: 'University of Moratuwa', year: '2020-2024', confidence: 0.98 }
      ],
      experience: [
        { 
          title: 'Data Science Intern', 
          company: 'TechCorp Inc', 
          period: 'Jun 2023 - Aug 2023',
          description: 'Worked on machine learning models for customer segmentation',
          confidence: 0.92
        },
        { 
          title: 'Research Assistant', 
          company: 'University of Moratuwa', 
          period: 'Jan 2023 - May 2023',
          description: 'Assisted in NLP research projects',
          confidence: 0.89
        }
      ],
      keyPhrases: [
        'Full-stack development',
        'Problem-solving skills',
        'Team collaboration',
        'Project management',
        'Algorithm optimization'
      ]
    }
  };

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        // In a real app, you would call the API
        // const data = await getResumeAnalysis(selectedCandidate);
        // setAnalysis(data);
        
        // Using mock data for demonstration
        setTimeout(() => {
          setAnalysis(mockAnalysisData[selectedCandidate] || {
            skills: [],
            education: [],
            experience: [],
            keyPhrases: []
          });
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to fetch analysis data');
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [selectedCandidate]);

  const renderSkillBar = (skill) => {
    return (
      <div key={skill.name} className="mb-2">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">{skill.name}</span>
          <span className="text-sm text-blue-400">{Math.round(skill.confidence * 100)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full" 
            style={{ width: `${skill.confidence * 100}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-400 mt-1">Mentioned {skill.count} times</div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">NLP Analysis Results</h2>
        
        <div className="relative">
          <select
            value={selectedCandidate}
            onChange={(e) => setSelectedCandidate(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white py-2 px-4 pr-8 rounded focus:outline-none focus:border-blue-500"
          >
            {candidates.map(candidate => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name} ({candidate.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills Analysis */}
          <div className="bg-gray-800 p-5 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Skills Analysis</h3>
            <div className="space-y-4">
              {analysis?.skills.map(renderSkillBar)}
            </div>
          </div>

          {/* Key Phrases Extracted */}
          <div className="bg-gray-800 p-5 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Key Phrases Extracted</h3>
            <div className="flex flex-wrap gap-2">
              {analysis?.keyPhrases.map((phrase, index) => (
                <span 
                  key={index} 
                  className="bg-blue-900/50 text-blue-200 px-3 py-1 rounded-full text-sm"
                >
                  {phrase}
                </span>
              ))}
            </div>
          </div>

          {/* Education History */}
          <div className="bg-gray-800 p-5 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Education</h3>
            {analysis?.education.map((edu, index) => (
              <div key={index} className="mb-4 border-l-2 border-blue-500 pl-4">
                <div className="text-lg font-medium">{edu.degree}</div>
                <div className="text-gray-300">{edu.institution}</div>
                <div className="text-sm text-gray-400">{edu.year}</div>
                <div className="text-xs text-blue-400 mt-1">
                  Confidence: {Math.round(edu.confidence * 100)}%
                </div>
              </div>
            ))}
          </div>

          {/* Work Experience */}
          <div className="bg-gray-800 p-5 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Experience</h3>
            {analysis?.experience.map((exp, index) => (
              <div key={index} className="mb-4 border-l-2 border-green-500 pl-4">
                <div className="text-lg font-medium">{exp.title}</div>
                <div className="text-gray-300">{exp.company}</div>
                <div className="text-sm text-gray-400">{exp.period}</div>
                <div className="text-sm mt-1">{exp.description}</div>
                <div className="text-xs text-green-400 mt-1">
                  Confidence: {Math.round(exp.confidence * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NLPResults;