import React, { useState, useEffect, useRef, useContext } from 'react';
import { Search, Filter, ChevronDown, X } from 'react-feather';
import { ThemeContext } from './ThemeContext';

// Sample jobs data
const JOBS = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechCorp Inc.",
      type: "Full-time",
      location: "New York, NY",
      salary: "$80,000 - $110,000",
      description: "We're looking for a talented frontend developer to join our growing team. You'll be responsible for building user interfaces and creating seamless user experiences.",
      responsibilities: [
        "Develop new user-facing features using React.js",
        "Build reusable components and libraries for future use",
        "Translate designs into high-quality code",
        "Optimize components for maximum performance",
        "Collaborate with backend developers and designers"
      ]
    },
  
    // ...other jobs (unchanged)
    {
      id: 2,
      title: "Backend Developer",
      company: "Data Solutions",
      type: "Part-time",
      location: "Remote",
      salary: "$60,000 - $90,000",
      description: "Join our team as a backend developer and help us build scalable and efficient server-side applications.",
      responsibilities: [
        "Design and implement server-side applications",
        "Collaborate with frontend developers to integrate user-facing elements",
        "Optimize applications for speed and scalability",
        "Maintain and improve existing codebase"
      ]
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "Creative Minds",
      type: "Contract",
      location: "San Francisco, CA",
      salary: "$70,000 - $100,000",
      description: "We are looking for a UI/UX designer to create engaging and user-friendly interfaces for our applications.",
      responsibilities: [
        "Conduct user research and usability testing",
        "Create wireframes, prototypes, and high-fidelity designs",
        "Collaborate with developers to implement designs",
        "Stay up-to-date with design trends and best practices"
      ]
    },
    {
      id: 4,
      title: "Data Analyst",
      company: "Insight Analytics",
      type: "Internship",
      location: "Chicago, IL",
      salary: "$40,000 - $60,000",
      description: "As a data analyst intern, you will assist in analyzing data and generating reports to support business decisions.",
      responsibilities: [
        "Collect and analyze data from various sources",
        "Create visualizations and reports to present findings",
        "Collaborate with team members to identify trends and insights",
        "Assist in data cleaning and preparation"
      ]
    },
    {
      id: 5,
      title: "Project Manager",
      company: "Global Solutions",
      type: "Full-time",
      location: "Austin, TX",
      salary: "$90,000 - $120,000",
      description: "We are seeking a project manager to oversee and coordinate projects from inception to completion.",
      responsibilities: [
        "Define project scope and objectives",
        "Develop detailed project plans and timelines",
        "Coordinate cross-functional teams to ensure project success",
        "Monitor project progress and make adjustments as needed"
      ]
    },
    {
      id: 6,
      title: "Marketing Specialist",
      company: "Brand Builders",
      type: "Part-time",
      location: "Boston, MA",
      salary: "$50,000 - $70,000",
      description: "Join our marketing team as a specialist and help us create effective marketing campaigns.",
      responsibilities: [
        "Develop and implement marketing strategies",
        "Conduct market research and analyze trends",
        "Create content for various marketing channels",
        "Collaborate with sales teams to drive leads"
      ]
    },
    {
      id: 7,
      title: "DevOps Engineer",
      company: "Cloud Innovations",
      type: "Contract",
      location: "Seattle, WA",
      salary: "$80,000 - $110,000",
      description: "We are looking for a DevOps engineer to help us automate and streamline our operations.",
      responsibilities: [
        "Implement CI/CD pipelines",
        "Monitor system performance and troubleshoot issues",
        "Collaborate with development teams to improve deployment processes",
        "Maintain cloud infrastructure"
      ]
    },
    {
      id: 8,
      title: "Content Writer",
      company: "Creative Content Co.",
      type: "Internship",
      location: "Remote",
      salary: "$30,000 - $50,000",
      description: "As a content writer intern, you will assist in creating engaging content for our website and social media.",
      responsibilities: [
        "Write blog posts, articles, and social media content",
        "Conduct research on various topics",
        "Collaborate with the ma    rketing team to develop content strategies"
      ]
    }
  ];

  
  const JobSearchAndFilter = ({ jobs, setFilteredJobs }) => {
    const { isDarkMode } = useContext(ThemeContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
      location: '',
      jobType: [],
      salary: [0, 200000],
    });
  
    const filterRef = useRef(null);
  
    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];
  
    // Close filter dropdown on outside click
    useEffect(() => {
      function handleClickOutside(event) {
        if (filterRef.current && !filterRef.current.contains(event.target)) {
          setShowFilters(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [filterRef]);
  
    // Helper function to parse salary range
    const parseSalary = (salaryString) => {
      const match = salaryString.match(/\$([\d,]+)\s*-\s*\$([\d,]+)/);
      if (match) {
        const minSalary = parseInt(match[1].replace(/,/g, ''), 10);
        const maxSalary = parseInt(match[2].replace(/,/g, ''), 10);
        return [minSalary, maxSalary];
      }
      return [0, 0];
    };
  
    // Filter jobs whenever search query or filters change
    useEffect(() => {
      const filteredResults = jobs.filter((job) => {
        // Text search
        const matchesSearch =
          searchQuery === '' ||
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase());
  
        // Location filter
        const matchesLocation =
          filters.location === '' ||
          job.location.toLowerCase().includes(filters.location.toLowerCase());
  
        // Job type filter
        const matchesJobType =
          filters.jobType.length === 0 || filters.jobType.includes(job.type);
  
        // Salary filter
        const [minSalary, maxSalary] = parseSalary(job.salary);
        const matchesSalary =
          minSalary >= filters.salary[0] && maxSalary <= filters.salary[1];
  
        return matchesSearch && matchesLocation && matchesJobType && matchesSalary;
      });
  
      setFilteredJobs(filteredResults);
    }, [searchQuery, filters, jobs, setFilteredJobs]);
  
    // Toggle job type selection
    const toggleJobType = (type) => {
      setFilters((prev) => ({
        ...prev,
        jobType: prev.jobType.includes(type)
          ? prev.jobType.filter((t) => t !== type)
          : [...prev.jobType, type],
      }));
    };
  
    // Reset all filters
    const resetFilters = () => {
      setFilters({
        location: '',
        jobType: [],
        salary: [0, 200000],
      });
      setSearchQuery('');
    };
  
    // Count active filters
    const activeFilterCount =
      (filters.location ? 1 : 0) +
      filters.jobType.length +
      (filters.salary[0] > 0 || filters.salary[1] < 200000 ? 1 : 0);
  
    return (
      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md mb-8`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <Search size={20} className="absolute left-3 top-2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for jobs, companies, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={18} />
              </button>
            )}
          </div>
  
          {/* Filters Button */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center px-4 py-3 rounded-lg ${
                isDarkMode
                  ? activeFilterCount > 0
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600'
                  : activeFilterCount > 0
                  ? 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                  : 'bg-gray-100 hover:bg-gray-200'
              } transition-all`}
            >
              <Filter size={18} className="mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <span
                  className={`ml-2 inline-flex items-center justify-center w-5 h-5 text-xs rounded-full ${
                    isDarkMode ? 'bg-white text-primary-600' : 'bg-primary-500 text-white'
                  }`}
                >
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown size={16} className="ml-2" />
            </button>
  
            {/* Filter Dropdown */}
            {showFilters && (
              <div
                className={`absolute right-0 mt-2 w-80 md:w-96 p-4 rounded-xl shadow-lg z-10 ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Filters</h3>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-primary-500 hover:text-primary-600"
                  >
                    Reset all
                  </button>
                </div>
  
                {/* Location filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Any location"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                    } focus:outline-none focus:ring-1 focus:ring-primary-500`}
                  />
                </div>
  
                {/* Job Type filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Job Type</label>
                  <div className="flex flex-wrap gap-2">
                    {jobTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => toggleJobType(type)}
                        className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                          filters.jobType.includes(type)
                            ? 'bg-primary-500 text-white'
                            : isDarkMode
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
  
                {/* Salary Range filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Salary Range: ${filters.salary[0].toLocaleString()} - $
                    {filters.salary[1].toLocaleString()}
                  </label>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="10000"
                      value={filters.salary[0]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          salary: [parseInt(e.target.value), filters.salary[1]],
                        })
                      }
                      className="w-full accent-primary-500 mb-2"
                    />
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="10000"
                      value={filters.salary[1]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          salary: [filters.salary[0], parseInt(e.target.value)],
                        })
                      }
                      className="w-full accent-primary-500"
                    />
                  </div>
                </div>
  
                {/* Apply Filters button */}
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default JobSearchAndFilter;