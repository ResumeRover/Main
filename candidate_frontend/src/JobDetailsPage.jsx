import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  Globe, 
  Award,
  CheckCircle
} from 'react-feather';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import img from "/logox.png";

const JobDetailsPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { jobId } = useParams();
  
  // Either use the job data from location state or fetch it based on jobId
  const [job, setJob] = useState(location.state?.job || null);
  const [loading, setLoading] = useState(!location.state?.job);
  const [error, setError] = useState(null);
  
  // Fetch job details if we don't have them from navigation state
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!location.state?.job) {
        setLoading(true);
        try {
          // Try to get job from localStorage first (admin-created jobs)
          const savedJobs = localStorage.getItem('jobRoles');
          if (savedJobs) {
            const parsedJobs = JSON.parse(savedJobs);
            const foundJob = parsedJobs.find(j => j.id === jobId || j.roleName === jobId);
            
            if (foundJob) {
              // Format job from localStorage format to our display format
              setJob({
                id: foundJob.id || jobId,
                title: foundJob.roleName,
                company: foundJob.company || 'Unknown',
                type: foundJob.jobType || 'Full-time',
                location: foundJob.location || 'Remote',
                salary: foundJob.salaryMin && foundJob.salaryMax ? 
                      `LKR ${foundJob.salaryMin} - ${foundJob.salaryMax}` : 
                      'Salary not specified',
                description: foundJob.responsibilities || 'No description available',
                responsibilities: foundJob.skills || [],
                required_education: foundJob.minEducation || '',
                preferred_education: foundJob.preferredEducation || '',
                remote: foundJob.isRemote
              });
              setLoading(false);
              return;
            }
          }
          
          // If not in localStorage, try API
          // Replace with your actual API endpoint
          const response = await fetch(`https://resumeparserjobscs3023.azurewebsites.net/api/jobs/${jobId}?code=yfdJdeNoFZzkQynk6p56ZETolRh1NqSpOaBYcTebXJO3AzFuWbJDmQ==`);
          
          if (!response.ok) {
            throw new Error('Job not found');
          }
          
          const data = await response.json();
          // Format job from API to our display format
          setJob({
            id: data.id,
            title: data.title,
            company: data.company || 'Not specified',
            type: data.job_type || 'Full-time',
            location: data.location || 'Remote',
            salary: data.salary_range || 'Not specified',
            description: data.description || 'No description available',
            responsibilities: data.required_skills ? Array.isArray(data.required_skills) ? 
                             data.required_skills : [data.required_skills] : 
                            ['No specific responsibilities listed'],
            required_education: data.required_education || '',
            preferred_education: data.preferred_education || '',
            remote: data.remote === 'True' || data.remote === true
          });
        } catch (err) {
          console.error('Failed to fetch job details:', err);
          setError('Failed to load job details. The job may no longer be available.');
          
          // If both storage and API fail, redirect to jobs list after a delay
          setTimeout(() => {
            navigate('/jobs');
          }, 3000);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchJobDetails();
  }, [jobId, location.state, navigate]);
  
  const handleApplyClick = () => {
    navigate(`/jobs/${jobId}/apply`, { state: { job: job } });
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'}`}>
        <div className="flex flex-col items-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDarkMode ? 'border-primary-400' : 'border-primary-600'} mb-4`}></div>
          <p className="text-lg">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'}`}>
        <div className={`max-w-md p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-center">
            <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full mb-4 ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
            <Link 
              to="/jobs"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg inline-block font-medium hover:bg-primary-700 transition-colors"
            >
              Browse Available Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'}`}>
        <div className={`max-w-md p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-center">
            <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full mb-4 ${isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Job Not Available</h2>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>The job details could not be loaded or may no longer be available.</p>
            <Link 
              to="/jobs"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg inline-block font-medium hover:bg-primary-700 transition-colors"
            >
              Browse Available Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'} transition-colors duration-300 pb-16`}>
      {/* Navigation */}
      <nav
        className={`fixed w-full z-10 transition-all duration-300 ${
          isDarkMode
            ? "bg-gray-900/80 backdrop-blur-md border-b border-gray-800/50"
            : "bg-white/80 backdrop-blur-md border-b border-slate-200/50"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center px-6 py-3">
          {/* Logo */}
          <div className="flex items-center">
            <div className="relative group overflow-hidden">
              <Link to="/">
                <div
                  className={`relative z-10 flex items-center justify-center space-x-3 px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? "bg-gray-100/60 backdrop-blur-sm border-gray-700/40" 
                      : "bg-white/80 backdrop-blur-sm border-gray-200/40"
                  } transition-all duration-300`}
                >
                  <div className="flex items-center justify-center w-full h-10">
                    <div className="relative">
                      <img
                        src={img}
                        alt="Logo"
                        className="relative h-10 w-30 rounded-full z-10 drop-shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Theme toggle */}
          <div>
            <div className="flex items-center space-x-4">
              <Link
                to="/jobs"
                className={`hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
                    : "bg-white hover:bg-gray-100 text-gray-700 shadow-sm"
                }`}
              >
                <Briefcase size={16} />
                <span className="text-sm font-medium">All Jobs</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 pt-24">
        {/* Back Button */}
        <Link 
          to="/jobs"
          className="group relative inline-flex px-4 py-2.5 rounded-lg overflow-hidden transition-all duration-300 mb-6"
        >
          {/* Button effects */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary-600/10 to-primary-400/10 
            dark:from-primary-500/15 dark:to-primary-400/15
            opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className={`absolute inset-0 rounded-lg ${
            isDarkMode 
              ? "shadow-[0_0_0_1px_rgba(59,130,246,0.1)_inset,0_-3px_4px_0_rgba(17,24,39,0.3)_inset]" 
              : "shadow-[0_0_0_1px_rgba(59,130,246,0.15)_inset,0_-2px_5px_0_rgba(0,0,0,0.05)_inset]"
          } group-hover:shadow-[0_0_0_1.5px_rgba(var(--color-primary-500),0.4)_inset,0_-3px_4px_0_rgba(17,24,39,0.2)_inset] transition-all duration-300`}></div>
          
          <div className={`absolute inset-0 rounded-lg ${
            isDarkMode
              ? "bg-gray-800" 
              : "bg-white"
          } group-hover:bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 transition-all duration-300`}></div>
          
          <div className="relative flex items-center">
            <span className="flex items-center justify-center w-6 h-6 rounded-full mr-2 
              bg-primary-500/10 group-hover:bg-primary-500/20 transition-all duration-300
              transform group-hover:-translate-x-1 group-hover:scale-110">
              <ArrowLeft size={14} className={`${
                isDarkMode ? 'text-primary-400' : 'text-primary-600'
              } transform transition-all duration-300`} />
            </span>
            
            <span className={`font-medium ${
              isDarkMode ? 'text-primary-400' : 'text-primary-600'
            } group-hover:bg-gradient-to-r group-hover:from-primary-500 group-hover:to-primary-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}>
              All Jobs
            </span>
          </div>
          
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>

        {/* Job Details Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className={`rounded-2xl shadow-lg p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} mb-8`}>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                <div>
                  <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {job.title}
                  </h1>
                  <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {job.company}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      isDarkMode ? 'bg-primary-900 text-primary-300' : 'bg-primary-100 text-primary-700'
                    }`}
                  >
                    {job.type}
                  </span>
                </div>
              </div>

              {/* Key Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <MapPin className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} size={18} />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Location</p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <DollarSign className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} size={18} />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Salary Range</p>
                    <p className="font-medium">{job.salary}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <Briefcase className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} size={18} />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Job Type</p>
                    <p className="font-medium">{job.type}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <Globe className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} size={18} />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Remote Work</p>
                    <p className="font-medium">{job.remote ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="mb-8">
                <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Job Description
                </h2>
                <div className={`space-y-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>{job.description}</p>
                </div>
              </div>

              {/* Required Skills */}
              <div className="mb-8">
                <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.responsibilities && job.responsibilities.map((skill, index) => (
                    <span 
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Required Education */}
              {(job.required_education || job.preferred_education) && (
                <div className="mb-8">
                  <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Education
                  </h2>
                  <div className={`space-y-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {job.required_education && (
                      <div className="flex items-start">
                        <Award className="mr-2 mt-1" size={16} />
                        <div>
                          <p className="font-medium">Required</p>
                          <p>{job.required_education}</p>
                        </div>
                      </div>
                    )}
                    {job.preferred_education && (
                      <div className="flex items-start">
                        <Award className="mr-2 mt-1" size={16} />
                        <div>
                          <p className="font-medium">Preferred</p>
                          <p>{job.preferred_education}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Apply Now Sidebar */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} sticky top-24`}>
              <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Quick Apply
              </h2>
              
              <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center mb-2">
                  <CheckCircle className={isDarkMode ? 'text-primary-400 mr-2' : 'text-primary-600 mr-2'} size={16} />
                  <p className="font-medium">2-minute application</p>
                </div>
                <div className="flex items-center mb-2">
                  <CheckCircle className={isDarkMode ? 'text-primary-400 mr-2' : 'text-primary-600 mr-2'} size={16} />
                  <p className="font-medium">AI-based resume reviewing</p>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={isDarkMode ? 'text-primary-400 mr-2' : 'text-primary-600 mr-2'} size={16} />
                  <p className="font-medium">Get feedback fast</p>
                </div>
              </div>
              
              <button
                onClick={handleApplyClick}
                className="w-full py-4 rounded-xl font-bold shadow-lg transition-all bg-primary-600 hover:bg-primary-700 text-white hover:scale-[1.02] hover:shadow-xl"
              >
                Apply Now
              </button>
              
              <p className={`text-center mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                This will redirect you to the application form.
              </p>

              <div className={`mt-8 p-4 rounded-lg border ${
                isDarkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
              }`}>
                <h3 className="font-semibold mb-2">About {job.company}</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {job.company} is a leading employer in the field, known for innovation and employee growth opportunities.
                </p>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <a href="#" className={`text-sm font-medium ${
                    isDarkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-800'
                  }`}>
                    Learn more about this company
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;