import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { MapPin, DollarSign, ArrowLeft, Briefcase, Clock } from 'react-feather';
import ThemeToggle from './ThemeToggle';
import { Home, Info } from 'react-feather'; // Added Info icon for About section
import { LogIn, Search } from 'react-feather'; // Added LogIn and Search icons for future use
import { Menu } from 'react-feather'; // Added Menu icon for mobile navigation
import img from "/logox.png"


const JobDetailsPage = ({ currentPage, selectedJob, handleBackClick, handleApplyClick }) => {
  const { isDarkMode } = useContext(ThemeContext);
  
  if (currentPage === 'job-details' && selectedJob) {
    // Ensure responsibilities is always an array
    const responsibilities = selectedJob.responsibilities || selectedJob.required_skills || [];
    const responsibilitiesList = Array.isArray(responsibilities) ? responsibilities : [responsibilities];
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

          {/* Enhanced Navigation Links */}
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

            {/* Active/Current Page Indicator - Add 'active' class to the link that represents the current page */}
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

              {/* <button className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-violet-500 hover:opacity-90 transition px-4 py-2 rounded-lg text-black font-medium">
                <LogIn size={16} />
                <span>Sign In</span>
              </button> */}

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
          {/* Modern 3D Back Button */}
          <button 
            onClick={() => setCurrentPage('jobs')} 
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
                Back to Jobs
              </span>
            </div>
            
            {/* Edge highlight for 3D effect */}
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <div className={`rounded-2xl shadow-lg p-8 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{selectedJob.title}</h1>
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                  <Briefcase size={16} className="mr-2" />
                  <span>{selectedJob.company}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                  <MapPin size={16} className="mr-2" />
                  <span>{selectedJob.location}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <DollarSign size={16} className="mr-2" />
                  <span>{selectedJob.salary_range || selectedJob.salary}</span>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${isDarkMode ? 'bg-primary-900 text-primary-300' : 'bg-primary-100 text-primary-700'}`}>
                {selectedJob.job_type || selectedJob.type}
              </span>
            </div>
            
            <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pt-6`}>
              <h2 className="text-xl font-bold mb-4">Job Description</h2>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedJob.description}</p>
              
              <h2 className="text-xl font-bold mb-4">Responsibilities</h2>
              <ul className="list-disc pl-5 mb-6">
                {responsibilitiesList.map((item, index) => (
                  <li key={index} className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {item}
                  </li>
                ))}
              </ul>
              
              {selectedJob.required_education && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">Required Education</h2>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {selectedJob.required_education.toUpperCase()}
                    {selectedJob.preferred_education && ` (Preferred: ${selectedJob.preferred_education.toUpperCase()})`}
                  </p>
                </div>
              )}
              
              <button
                onClick={handleApplyClick}
                className="w-full py-4 bg-primary-600 dark:bg-primary-500 text-white rounded-xl font-bold shadow-lg transform transition-all hover:bg-primary-700 dark:hover:bg-primary-600 hover:shadow-xl"
              >
                Apply Now
              </button>
            </div>
          </div>
          
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <h2 className="text-xl font-bold mb-4">About the Company</h2>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              {selectedJob.company} is a leading company specializing in innovative solutions.
              {selectedJob.remote === 'True' || selectedJob.remote === true ? 
                ' This is a remote position allowing you to work from anywhere.' : 
                ` This position is based in ${selectedJob.location}.`}
            </p>
            <div className="flex items-center">
              <Clock size={16} className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Posted recently</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default JobDetailsPage;