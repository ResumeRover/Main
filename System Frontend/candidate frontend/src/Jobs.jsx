import React, { useContext, useState, useEffect, useRef } from 'react';
import { ThemeContext } from './ThemeContext';
import { 
  ArrowLeft, 
  Search, 
  ChevronRight, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Filter, 
  Star, 
  Clock, 
  Calendar,
  Home,
  Info,
  Menu,
  BookOpen,
  Award
} from 'react-feather';
import ThemeToggle from './ThemeToggle';
import JobSearchAndFilter from './JobSearchAndFilter';
import axios from 'axios';
import img from "/logox.png"
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Jobs = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [highlightedJob, setHighlightedJob] = useState(null);
  const filterRef = useRef(null); // Reference to the filter component for reset
  const navigate = useNavigate();
  const location = useLocation();

  // Sample jobs data for fallback
  const SAMPLE_JOBS = [
    {
      id: "sample-job-1",
      title: "Frontend Developer",
      company: "Tech Solutions",
      type: "Full-time",
      location: "Remote",
      salary: "LKR 100,000 - 150,000",
      description: "We're looking for a skilled frontend developer with experience in React, TypeScript, and modern web technologies.",
      responsibilities: ["React", "TypeScript", "CSS", "UI/UX"],
      required_education: "Bachelor's",
      preferred_education: "Master's",
      remote: true,
      posted_date: "2023-12-15",
      experience: "2-4 years"
    },
    {
      id: "sample-job-2",
      title: "Backend Engineer",
      company: "DataSystems Inc",
      type: "Full-time",
      location: "Colombo",
      salary: "LKR 120,000 - 180,000",
      description: "Seeking a backend engineer to develop and maintain our server-side applications and databases.",
      responsibilities: ["Node.js", "MongoDB", "API Development", "AWS"],
      required_education: "Bachelor's",
      preferred_education: "Master's",
      remote: false,
      posted_date: "2024-01-05",
      experience: "3-5 years"
    },
    {
      id: "sample-job-3",
      title: "UI/UX Designer",
      company: "Creative Minds",
      type: "Contract",
      location: "Hybrid",
      salary: "LKR 90,000 - 130,000",
      description: "Looking for a creative designer to improve user experiences across our digital products.",
      responsibilities: ["Figma", "User Research", "Prototyping", "UI Design"],
      required_education: "Bachelor's",
      preferred_education: "",
      remote: true,
      posted_date: "2024-01-12",
      experience: "2+ years"
    }
  ];

  // Load jobs from both API and localStorage
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      
      try {
        // Try to fetch from API first
        const response = await axios.get(
          "https://resumeparserjobscs3023.azurewebsites.net/api/jobs?code=yfdJdeNoFZzkQynk6p56ZETolRh1NqSpOaBYcTebXJO3AzFuWbJDmQ==", 
          {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        );
        
        // Process API jobs
        let apiJobs = [];
        if (response.data && Array.isArray(response.data)) {
          apiJobs = response.data.map(job => ({
            id: job.id || Math.random().toString(36).substr(2, 9),
            title: job.title,
            company: job.company || 'Not specified',
            type: job.job_type || 'Full-time',
            location: job.location || 'Remote',
            salary: job.salary_range || 'LKR Not specified',
            description: job.description || 'No description available',
            responsibilities: job.required_skills ? job.required_skills.map(skill => `${skill}`) : 
                             ['No specific responsibilities listed'],
            required_education: job.required_education || '',
            preferred_education: job.preferred_education || '',
            remote: job.remote === 'True' || job.remote === true,
            posted_date: job.posted_date || getRandomDate(),
            experience: job.experience || getRandomExperience()
          }));
        }
        
        // Try to load from localStorage as additional source
        let localJobs = [];
        try {
          const savedJobs = localStorage.getItem('jobRoles');
          if (savedJobs) {
            const jobData = JSON.parse(savedJobs);
            localJobs = jobData.map(job => ({
              id: job.id || Math.random().toString(36).substr(2, 9),
              title: job.roleName,
              company: job.company || 'Unknown',
              type: job.jobType || 'Full-time',
              location: job.location || 'Remote',
              salary: job.salaryMin && job.salaryMax ? 
                    `LKR ${job.salaryMin} - ${job.salaryMax}` : 
                    'Salary not specified',
              description: job.responsibilities || 'No description available',
              responsibilities: job.skills || [],
              required_education: job.minEducation || '',
              preferred_education: job.preferredEducation || '',
              remote: job.isRemote,
              posted_date: job.posted_date || getRandomDate(),
              experience: job.experience || getRandomExperience()
            }));
          }
        } catch (localErr) {
          console.error("Error loading local jobs:", localErr);
        }
        
        // Combine all job sources with unique entries
        const combinedJobs = [
          ...apiJobs,
          ...localJobs,
          ...SAMPLE_JOBS
        ].filter((job, index, self) => 
          index === self.findIndex(j => 
            (j.id && j.id === job.id) || (j.title === job.title && j.company === job.company)
          )
        );
        
        setAllJobs(combinedJobs);
        setFilteredJobs(combinedJobs);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs from server');
        
        // Fall back to localStorage and sample jobs as a backup
        try {
          let fallbackJobs = [];
          
          // Try localStorage
          const savedJobs = localStorage.getItem('jobRoles');
          if (savedJobs) {
            const jobData = JSON.parse(savedJobs);
            fallbackJobs = jobData.map(job => ({
              id: job.id || Math.random().toString(36).substr(2, 9),
              title: job.roleName,
              company: job.company || 'Unknown',
              type: job.jobType || 'Full-time',
              location: job.location || 'Remote',
              salary: job.salaryMin && job.salaryMax ? 
                    `LKR ${job.salaryMin} - ${job.salaryMax}` : 
                    'Salary not specified',
              description: job.responsibilities || 'No description available',
              responsibilities: job.skills || [],
              required_education: job.minEducation || '',
              preferred_education: job.preferredEducation || '',
              remote: job.isRemote,
              posted_date: job.posted_date || getRandomDate(),
              experience: job.experience || getRandomExperience()
            }));
          }
          
          // Add sample jobs as well
          const combined = [...fallbackJobs, ...SAMPLE_JOBS];
          setAllJobs(combined);
          setFilteredJobs(combined);
        } catch (fallbackErr) {
          console.error('Error loading fallback jobs:', fallbackErr);
          
          // Last resort - use only sample jobs
          setAllJobs(SAMPLE_JOBS);
          setFilteredJobs(SAMPLE_JOBS);
        }
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Helper function to generate random dates for sample jobs
  const getRandomDate = () => {
    const currentDate = new Date();
    const pastDate = new Date();
    pastDate.setDate(currentDate.getDate() - Math.floor(Math.random() * 30));
    return pastDate.toISOString().split('T')[0];
  };

  // Helper function to generate random experience requirements
  const getRandomExperience = () => {
    const experiences = ['1-2 years', '2-3 years', '3-5 years', '5+ years', 'Entry Level'];
    return experiences[Math.floor(Math.random() * experiences.length)];
  };

  // Calculate days ago from date string
  const getDaysAgo = (dateString) => {
    if (!dateString) return 'Recently';
    
    const jobDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - jobDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Reset all filters
  const resetFilters = () => {
    setFilteredJobs(allJobs);
    // If you have a reference to the filter component, reset it
    if (filterRef.current && typeof filterRef.current.resetFilters === 'function') {
      filterRef.current.resetFilters();
    }
  };

  // Grid view job card component
  const JobCardGrid = ({ job }) => {
    const handleClick = () => {
      navigate(`/jobs/${job.id}`, { state: { job } });
    };
    
    return (
      <div
        onClick={handleClick}
        className={`rounded-xl cursor-pointer transition-all duration-200 ${
          isDarkMode 
            ? 'bg-gray-800 hover:bg-gray-750 border border-transparent hover:border-gray-700' 
            : 'bg-white hover:shadow-md border border-transparent hover:border-gray-200'
        } shadow p-6 relative`}
      >
        <div className="relative">
          <div className="flex justify-between items-start mb-4">
            <h2 className={`text-xl font-bold hover:text-primary-500 transition-colors duration-200`}>
              {job.title}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isDarkMode ? 'bg-primary-900/50 text-primary-300' : 'bg-primary-100 text-primary-700'
              }`}
            >
              {job.type}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
            <Briefcase size={16} className="mr-2" />
            <span className="font-medium">{job.company}</span>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPin size={16} className="mr-2 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <DollarSign size={16} className="mr-2 flex-shrink-0" />
              <span className="truncate">{job.salary}</span>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Award size={16} className="mr-2 flex-shrink-0" />
              <span className="truncate">{job.experience || 'Experience not specified'}</span>
            </div>
          </div>
          
          <p className={`mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {job.description}
          </p>
          
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {job.responsibilities.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className={`text-xs px-2 py-1 rounded-full ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
                {job.responsibilities.length > 3 && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    +{job.responsibilities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Clock size={14} className="inline mr-1" />
              {getDaysAgo(job.posted_date)}
            </div>
            <span className={`flex items-center font-medium ${
              isDarkMode ? 'text-primary-400' : 'text-primary-600'
            }`}>
              View Details <ChevronRight size={16} className="ml-1" />
            </span>
          </div>
        </div>
      </div>
    );
  };

  // List view job card
  const JobCardList = ({ job }) => {
    const handleClick = () => {
      navigate(`/jobs/${job.id}`, { state: { job } });
    };
    
    return (
      <div
        onClick={handleClick}
        className={`rounded-xl cursor-pointer transition-all duration-200 ${
          isDarkMode 
            ? 'bg-gray-800 hover:bg-gray-750 border-l-4 border-transparent hover:border-l-primary-500' 
            : 'bg-white hover:shadow-md border-l-4 border-transparent hover:border-l-primary-500'
        } shadow p-5 relative`}
      >
        <div className="relative flex flex-col md:flex-row">
          <div className="md:flex-1 mb-4 md:mb-0 md:mr-6">
            <div className="flex justify-between items-start mb-3">
              <h2 className={`text-xl font-bold hover:text-primary-500 transition-colors duration-200`}>
                {job.title}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isDarkMode ? 'bg-primary-900/50 text-primary-300' : 'bg-primary-100 text-primary-700'
                }`}
              >
                {job.type}
              </span>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
              <Briefcase size={16} className="mr-2" />
              <span className="font-medium">{job.company}</span>
            </div>
            
            <p className={`mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {job.description}
            </p>
            
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {job.responsibilities.slice(0, 4).map((skill, index) => (
                    <span
                      key={index}
                      className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                  {job.responsibilities.length > 4 && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      +{job.responsibilities.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="md:w-64 flex flex-col justify-between">
            <div className="space-y-2 mb-3">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <MapPin size={16} className="mr-2 flex-shrink-0" />
                <span className="truncate">{job.location}</span>
              </div>
              
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <DollarSign size={16} className="mr-2 flex-shrink-0" />
                <span className="truncate">{job.salary}</span>
              </div>
              
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Award size={16} className="mr-2 flex-shrink-0" />
                <span className="truncate">{job.experience || 'Not specified'}</span>
              </div>
              
              {job.required_education && (
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <BookOpen size={16} className="mr-2 flex-shrink-0" />
                  <span className="truncate">{job.required_education}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Clock size={14} className="inline mr-1" />
                {getDaysAgo(job.posted_date)}
              </div>
              <span className={`flex items-center font-medium ${
                isDarkMode ? 'text-primary-400' : 'text-primary-600'
              }`}>
                Details <ChevronRight size={16} className="ml-1" />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // View toggle button component
  const ViewToggle = () => {
    return (
      <div className={`flex p-1 rounded-lg ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <button
          onClick={() => setViewMode('grid')}
          className={`px-3 py-1.5 rounded-md flex items-center ${
            viewMode === 'grid' 
              ? isDarkMode 
                ? 'bg-gray-600 text-primary-400' 
                : 'bg-white shadow-sm text-primary-600'
              : isDarkMode 
                ? 'text-gray-400 hover:text-gray-300' 
                : 'text-gray-600 hover:text-gray-800'
          } transition-colors`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Grid
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-3 py-1.5 rounded-md flex items-center ${
            viewMode === 'list' 
              ? isDarkMode 
                ? 'bg-gray-600 text-primary-400' 
                : 'bg-white shadow-sm text-primary-600'
              : isDarkMode 
                ? 'text-gray-400 hover:text-gray-300' 
                : 'text-gray-600 hover:text-gray-800'
          } transition-colors`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          List
        </button>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'}`}>
      {/* Navigation */}
      <nav
        className={`fixed w-full z-10 ${
          isDarkMode
            ? "bg-gray-900/95 border-b border-gray-800"
            : "bg-white/95 border-b border-slate-200"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center px-6 py-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <div
                className={`flex items-center justify-center space-x-3 px-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? "bg-gray-800 border-gray-700" 
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-center w-full h-10">
                  <img
                    src={img}
                    alt="Logo"
                    className="h-10 w-30 rounded-full z-10"
                  />
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation links */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Jobs Link - Active */}
            <Link
              to="/jobs"
              className={`font-medium text-base px-3 py-1.5 text-primary-500 rounded-lg
              ${isDarkMode ? "bg-gray-800/50" : "bg-white/50"} 
              shadow-sm`}
            >
              <span className="inline-flex items-center">
                <Briefcase size={16} className="mr-1.5" />
                Jobs
              </span>
            </Link>

            {/* Home Link */}
            <Link
              to="/"
              className={`font-medium text-base px-1.5 py-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}
              hover:text-primary-500`}
            >
              <span className="inline-flex items-center">
                <Home size={16} className="mr-1.5 opacity-80" />
                Home
              </span>
            </Link>

            {/* About Link */}
            <Link
              to="/about"
              className={`font-medium text-base px-1.5 py-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}
              hover:text-primary-500`}
            >
              <span className="inline-flex items-center">
                <Info size={16} className="mr-1.5 opacity-80" />
                About
              </span>
            </Link>
          </div>

          {/* Right side elements */}
          <div className="flex items-center space-x-4">
            <button
              className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <Search
                size={16}
                className={isDarkMode ? "text-gray-400" : "text-gray-500"}
              />
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Search...
              </span>
            </button>

            <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>

            <ThemeToggle />

            <button className="md:hidden">
              <Menu
                className={isDarkMode ? "text-grey-300" : "text-gray-700"}
                size={24}
              />
            </button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-6 pt-28 pb-16">
        {/* Page header */}
        <div className="mb-8">
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Discover Your Perfect Job</h1>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl`}>
                  Browse through our curated list of opportunities tailored to your skills and experience.
                </p>
              </div>
              
              {/* Back Button */}
              <Link 
                to="/"
                className={`px-4 py-2.5 rounded-lg ${
                  isDarkMode 
                    ? "bg-gray-700 hover:bg-gray-600 text-primary-400" 
                    : "bg-gray-100 hover:bg-gray-200 text-primary-600"
                } transition-colors flex items-center`}
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        
        {/* Search and filter section */}
        <div className={`rounded-xl mb-8 p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Filter size={18} className="mr-2" />
              Search & Filter
            </h2>
            
            <div className="flex space-x-3 items-center">
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Showing <span className="font-semibold">{filteredJobs.length}</span> of {allJobs.length} jobs
              </div>
              <ViewToggle />
            </div>
          </div>
          
          {/* Search and filter component */}
          <JobSearchAndFilter 
            jobs={allJobs} 
            setFilteredJobs={setFilteredJobs} 
            ref={filterRef}
          />
        </div>
        
        {/* Error Message */}
        {error && (
          <div 
            className={`mb-6 p-4 rounded-xl ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'} border ${isDarkMode ? 'border-red-800' : 'border-red-200'} ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}
          >
            <p>Error loading jobs: {error}</p>
            <p className="text-sm mt-1">Showing fallback job listings.</p>
          </div>
        )}
        
        {/* Display job results */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block h-12 w-12 border-4 border-t-primary-500 border-r-primary-300 border-b-primary-200 border-l-primary-300 rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium">Loading opportunities for you...</p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>This may take a moment</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div
            className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 gap-6" 
              : "space-y-4"
            }
          >
            {filteredJobs.map((job) => (
              viewMode === 'grid' 
                ? <JobCardGrid key={job.id || job.title} job={job} /> 
                : <JobCardList key={job.id || job.title} job={job} />
            ))}
          </div>
        ) : (
          <div 
            className={`text-center py-16 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Briefcase size={32} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
            </div>
            <h3 className="text-xl font-semibold mb-2">No jobs match your search criteria</h3>
            <p className={`max-w-md mx-auto mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Try adjusting your filters or search terms to see more opportunities
            </p>
            <button
              onClick={resetFilters}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-primary-600 hover:bg-primary-700' 
                  : 'bg-primary-600 hover:bg-primary-700'
              } text-white transition-colors`}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;