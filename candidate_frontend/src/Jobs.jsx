import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';
import { ArrowLeft, Search, ChevronRight, MapPin, DollarSign, Briefcase, Filter } from 'react-feather';
import ThemeToggle from './ThemeToggle';
import { Home, Info } from 'react-feather';
import { Menu } from 'react-feather';
import { LogIn } from 'react-feather';
import JobSearchAndFilter from './JobSearchAndFilter';
import { X } from 'react-feather';
import axios from 'axios';
import img from "/logox.png"

const Jobs = ({ currentPage, JOBS, handleJobClick, handleBackClick, setCurrentPage }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load jobs from both API and props
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
            salary: job.salary_range || '$Not specified',
            description: job.description || 'No description available',
            responsibilities: job.required_skills ? job.required_skills.map(skill => `${skill}`) : 
                             ['No specific responsibilities listed'],
            required_education: job.required_education || '',
            preferred_education: job.preferred_education || '',
            remote: job.remote === 'True' || job.remote === true
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
              remote: job.isRemote
            }));
          }
        } catch (localErr) {
          console.error("Error loading local jobs:", localErr);
        }
        
        // Combine all job sources with unique entries
        const combinedJobs = [
          ...apiJobs,
          ...localJobs,
          ...(JOBS || [])
        ].filter((job, index, self) => 
          index === self.findIndex(j => j.title === job.title)
        );
        
        setAllJobs(combinedJobs);
        setFilteredJobs(combinedJobs);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs from server');
        
        // Fall back to localStorage and props as a backup
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
              remote: job.isRemote
            }));
          }
          
          // Add sample jobs from props as well
          const combined = [...fallbackJobs, ...(JOBS || [])];
          setAllJobs(combined);
          setFilteredJobs(combined);
        } catch (fallbackErr) {
          console.error('Error loading fallback jobs:', fallbackErr);
          
          // Last resort - use only sample jobs from props
          if (JOBS && JOBS.length > 0) {
            setAllJobs(JOBS);
            setFilteredJobs(JOBS);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [JOBS]);

  const JobCard = ({ job, handleJobClick }) => {
    const { isDarkMode } = useContext(ThemeContext);
    
    return (
      <div
        onClick={() => handleJobClick(job)}
        className={`rounded-2xl cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-xl ${
          isDarkMode ? 'bg-gray-800 hover:shadow-primary-900/20' : 'bg-white hover:shadow-primary-500/20'
        } shadow-lg p-6`}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">{job.title}</h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isDarkMode ? 'bg-primary-900 text-primary-300' : 'bg-primary-100 text-primary-700'
            }`}
          >
            {job.type}
          </span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
          <Briefcase size={16} className="mr-2" />
          <span>{job.company}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
          <MapPin size={16} className="mr-2" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
          <DollarSign size={16} className="mr-2" />
          <span>{job.salary}</span>
        </div>
        <p className={`mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {job.description}
        </p>
        <div className="flex justify-end">
          <button className={`flex items-center font-medium ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
            View Details <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    );
  };

  if (currentPage === 'jobs') {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'} transition-colors duration-300`}>
        {/* Navigation */}
        <nav
          className={`fixed w-full z-10 transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-900/80 backdrop-blur-md border-b border-gray-800/50"
              : "bg-white/80 backdrop-blur-md border-b border-slate-200/50"
          }`}
        >
          <div className="container mx-auto flex justify-between items-center px-6 py-3">
            {/* Logo and brand name with unique glowing animation */}
            <div className="flex items-center">
              <div className="relative group overflow-hidden">
                {/* Animated circular flare effect */}
                <div className="absolute inset-0 z-0">
                  <div className="absolute -inset-[10%] w-[120%] h-[120%] bg-gradient-to-r from-primary-600/20 via-violet-500/30 to-primary-600/20 opacity-0 group-hover:opacity-100 rotate-0 group-hover:rotate-180 scale-0 group-hover:scale-100 transition-all duration-1000 rounded-full blur-md"></div>
                </div>
                
                {/* Traveling glow effect */}
                <div className="absolute -inset-1 z-0 ">
                  <div className="w-20 h-20 absolute -top-10 -left-10 bg-primary-100/90 rounded-full blur-xl animate-glow-travel"></div>
                </div>
                
                {/* Main container */}
                <div
                  className={`relative z-10 flex items-center justify-center space-x-3 px-4 py-2 rounded-lg border bg-white ${
                    isDarkMode 
                      ? "bg-gray-100/60 backdrop-blur-sm border-gray-700/40 " 
                      : "bg-white/80 backdrop-blur-sm border-gray-200/40"
                  } transition-all duration-300`}
                >
                  <div className="flex items-center justify-center w-full h-10 ">
                    {/* Logo with unique pulsing glow */}
                    <div className="relative">
                      {/* Inner ring */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-violet-500 blur-sm opacity-0 group-hover:opacity-60 scale-90 group-hover:scale-110 transition-all duration-700 animate-ping-slow"></div>
                      
                      {/* Outer ring */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-primary-500 blur-md opacity-0 group-hover:opacity-40 scale-75 group-hover:scale-125 transition-all duration-1000 animate-pulse-reverse"></div>
                      
                      {/* Logo image with subtle bounce */}
                      <img
                        src={img}
                        alt="Logo"
                        className="relative h-10 w-30 rounded-full animate-subtle-bounce z-10 drop-shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Jobs Link */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-violet-500/0 rounded-lg blur-md group-hover:via-primary-500/20 transition-all duration-300"></div>
                <a
                  href="#"
                  className={`relative font-medium text-base px-1.5 py-1 transition-all duration-300 
                    ${isDarkMode ? "text-gray-300" : "text-gray-700"}
                    group-hover:text-primary-500 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 
                    after:bg-gradient-to-r after:from-primary-500 after:to-violet-500 
                    after:transition-all after:duration-300 group-hover:after:w-full`}
                >
                  <span className="relative">
                    <span className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary-500/10 to-violet-500/10 blur-sm transition-all duration-300"></span>
                    <span className="relative inline-flex items-center">
                      <Briefcase size={16} className="mr-1.5 opacity-80" />
                      Jobs
                    </span>
                  </span>
                </a>
              </div>

              {/* Companies Link */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-violet-500/0 rounded-lg blur-md group-hover:via-primary-500/20 transition-all duration-300"></div>
                <a
                  href="#"
                  className={`relative font-medium text-base px-1.5 py-1 transition-all duration-300 
                    ${isDarkMode ? "text-gray-300" : "text-gray-700"}
                    group-hover:text-primary-500 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 
                    after:bg-gradient-to-r after:from-primary-500 after:to-violet-500 
                    after:transition-all after:duration-300 group-hover:after:w-full`}
                >
                  <span className="relative">
                    <span className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary-500/10 to-violet-500/10 blur-sm transition-all duration-300"></span>
                    <span className="relative inline-flex items-center">
                      <Briefcase size={16} className="mr-1.5 opacity-80" />
                      Companies
                    </span>
                  </span>
                </a>
              </div>

              {/* About Link */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-violet-500/0 rounded-lg blur-md group-hover:via-primary-500/20 transition-all duration-300"></div>
                <a
                  href="#"
                  className={`relative font-medium text-base px-1.5 py-1 transition-all duration-300 
                    ${isDarkMode ? "text-gray-300" : "text-gray-700"}
                    group-hover:text-primary-500 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 
                    after:bg-gradient-to-r after:from-primary-500 after:to-violet-500 
                    after:transition-all after:duration-300 group-hover:after:w-full`}
                >
                  <span className="relative">
                    <span className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary-500/10 to-violet-500/10 blur-sm transition-all duration-300"></span>
                    <span className="relative inline-flex items-center">
                      <Info size={16} className="mr-1.5 opacity-80" />
                      About
                    </span>
                  </span>
                </a>
              </div>

              {/* Active/Current Page Indicator */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/10 via-primary-500/20 to-violet-500/10 rounded-lg blur-md"></div>
                <a
                  href="#"
                  className={`relative font-medium text-base px-3 py-1.5 transition-all duration-300 
                    text-primary-500 rounded-lg
                    ${isDarkMode ? "bg-gray-800/50" : "bg-white/50"} 
                    shadow-sm after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full 
                    after:bg-gradient-to-r after:from-primary-500 after:to-violet-500`}
                >
                  <span className="relative">
                    <span className="absolute -inset-1 rounded-lg opacity-30 bg-gradient-to-r from-primary-500/10 to-violet-500/10 blur-sm animate-pulse-slow"></span>
                    <span className="relative inline-flex items-center">
                      <Home size={16} className="mr-1.5" />
                      Home
                    </span>
                  </span>
                </a>
              </div>
            </div>

            {/* Right side elements */}
            <div className="flex items-center space-x-4">
              <button
                className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full transition ${
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
        
        <div className="container mx-auto px-6 pt-24 pb-16">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Available Positions</h1>
            
            {/* Back Button */}
            <button 
              onClick={() => setCurrentPage('home')} 
              className="group relative px-4 py-2.5 rounded-lg overflow-hidden transition-all duration-300"
            >
              {/* 3D shadow and glow effects */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary-600/10 to-primary-400/10 
                dark:from-primary-500/15 dark:to-primary-400/15
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className={`absolute inset-0 rounded-lg ${
                isDarkMode 
                  ? "shadow-[0_0_0_1px_rgba(59,130,246,0.1)_inset,0_-3px_4px_0_rgba(17,24,39,0.3)_inset]" 
                  : "shadow-[0_0_0_1px_rgba(59,130,246,0.15)_inset,0_-2px_5px_0_rgba(0,0,0,0.05)_inset]"
              } group-hover:shadow-[0_0_0_1.5px_rgba(var(--color-primary-500),0.4)_inset,0_-3px_4px_0_rgba(17,24,39,0.2)_inset] transition-all duration-300`}></div>
              
              {/* Background with gradient */}
              <div className={`absolute inset-0 rounded-lg ${
                isDarkMode
                  ? "bg-gray-800" 
                  : "bg-white"
              } group-hover:bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 transition-all duration-300`}></div>
              
              {/* Animated arrow and text */}
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
                  Back to Home
                </span>
              </div>
              
              {/* Edge highlight for 3D effect */}
              <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
          
          {/* Search and filter component */}
          <JobSearchAndFilter jobs={allJobs} setFilteredJobs={setFilteredJobs} />
          
          {/* Error Message */}
          {error && (
            <div className={`mb-6 p-4 rounded-xl ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'} border ${isDarkMode ? 'border-red-800' : 'border-red-200'} text-${isDarkMode ? 'red-300' : 'red-600'}`}>
              <p>Error loading jobs: {error}</p>
              <p className="text-sm mt-1">Showing fallback job listings.</p>
            </div>
          )}
          
          {/* Display job results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="text-center py-8 col-span-2 flex justify-center items-center">
                <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${isDarkMode ? 'border-primary-400' : 'border-primary-600'} mr-3`}></div>
                <span>Loading jobs...</span>
              </div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard key={job.id || job.title} job={job} handleJobClick={handleJobClick} />
              ))
            ) : (
              <div className="text-center py-8 col-span-2">
                <p className="text-lg">No jobs match your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default Jobs;