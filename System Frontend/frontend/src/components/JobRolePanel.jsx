import React, { useState, useEffect } from 'react';
import axios from 'axios';

function JobRolePanel() {
  // Education data from database
  const EDUCATION_RANKS = {
    "others": 0,
    "high school": 1,
    "certificate": 1,
    "ol": 1,
    "al": 2,
    "diploma": 3,
    "associate": 3,
    "nvq": 3,
    "hnd": 3,
    "aa": 3,
    "aas": 3,
    "as": 3,
    "slim": 3,  
    "nibt": 3,   
    "bsc": 4,
    "bs": 4,
    "ba": 4,
    "be": 4,
    "btech": 4,
    "bit": 4,    
    "cima": 4,   
    "acca": 4,      
    "bcom": 4,
    "bba": 4,
    "bca": 4,
    "msc": 5,
    "ms": 5,
    "ma": 5,
    "me": 5,
    "mtech": 5,
    "mcom": 5,
    "mba": 5,
    "mca": 5,
    "ca": 5,
    "phd": 6
  };

  // Group education by rank for better organization in UI
  const educationByRank = {};
  Object.entries(EDUCATION_RANKS).forEach(([key, rank]) => {
    if (!educationByRank[rank]) {
      educationByRank[rank] = [];
    }
    educationByRank[rank].push(key);
  });

  const initialFormState = {
    roleName: '',
    department: '',
    experienceLevel: '0',
    required_experience: 0,
    skills: [],
    minEducation: 'bsc',
    preferredEducation: 'msc',
    responsibilities: '',
    qualifications: '',
    status: 'active',
    company: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    jobType: 'Full-time',
    isRemote: false
  };

  const [formData, setFormData] = useState(initialFormState);
  const [currentSkill, setCurrentSkill] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [jobRoles, setJobRoles] = useState([]);
  const [hoveredRole, setHoveredRole] = useState(null);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [formMode, setFormMode] = useState('add');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create axios instance with proper error handling
  const api = axios.create({
    baseURL: "https://resumeparserjobscs3023.azurewebsites.net/api",
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });

  // Add interceptor for error handling
  api.interceptors.response.use(
    response => response,
    error => {
      console.error('API Error:', error);
      if (error.response) {
        // Server responded with a status code outside of 2xx range
        console.error('Error data:', error.response.data);
        return Promise.reject(new Error(error.response.data.message || 'An error occurred with the request'));
      } else if (error.request) {
        // Request was made but no response received
        return Promise.reject(new Error('No response received from server. Please check your connection.'));
      } else {
        // Error setting up the request
        return Promise.reject(new Error('Error setting up the request: ' + error.message));
      }
    }
  );

  // Function to format data for persistent storage
  const saveToLocalStorage = (roles) => {
    localStorage.setItem('jobRoles', JSON.stringify(roles));
  };

  // Function to load data from persistent storage
  const loadFromLocalStorage = () => {
    const savedRoles = localStorage.getItem('jobRoles');
    return savedRoles ? JSON.parse(savedRoles) : [];
  };

  // Fetch job roles on component mount
  useEffect(() => {
    const fetchJobRoles = async () => {
      setIsLoading(true);
      try {
        // Try to fetch from API first
        const response = await api.get("/jobs?code=yfdJdeNoFZzkQynk6p56ZETolRh1NqSpOaBYcTebXJO3AzFuWbJDmQ==");
        if (response.data && Array.isArray(response.data)) {
          // Transform the API response to match our local format
          const transformedRoles = response.data.map(job => ({
            id: job.id || Math.random().toString(36).substr(2, 9),
            roleName: job.title || 'Untitled Position',
            department: job.department || 'Unspecified',
            experienceLevel: job.required_experience?.toString() || '0',
            required_experience: job.required_experience || 0,
            skills: job.required_skills || [],
            minEducation: job.required_education?.toLowerCase() || 'bsc',
            preferredEducation: job.preferred_education?.toLowerCase() || 'msc',
            responsibilities: job.description || '',
            qualifications: job.additional_qualifications || '',
            status: job.is_active ? 'active' : 'archived',
            company: job.company || '',
            location: job.location || '',
            salaryMin: job.salary_range?.split('-')[0]?.trim().replace(/[^0-9]/g, '') || '',
            salaryMax: job.salary_range?.split('-')[1]?.trim().replace(/[^0-9]/g, '') || '',
            jobType: job.job_type || 'Full-time',
            isRemote: job.remote === 'True' || job.remote === true
          }));
          setJobRoles(transformedRoles);
          saveToLocalStorage(transformedRoles); // Save to localStorage as backup
        }
      } catch (err) {
        console.error('Error fetching job roles from API:', err);
        // Fallback to local storage if API fails
        const savedRoles = loadFromLocalStorage();
        setJobRoles(savedRoles);
        setError("Couldn't connect to server. Loading saved roles from local storage.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleAddSkill = () => {
    if (currentSkill.trim() !== '' && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prevState => ({
        ...prevState,
        skills: [...prevState.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };
  
  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prevState => ({
      ...prevState,
      skills: prevState.skills.filter(skill => skill !== skillToRemove)
    }));
  };
  
  const resetForm = () => {
    setFormData(initialFormState);
    setCurrentSkill('');
    setFormMode('add');
    setEditingRoleId(null);
    setError(null);
  };

  const handleCancel = () => {
    resetForm();
  };
  
  const handleSubmit = async () => {
    // Input validation
    if (!formData.roleName || !formData.department || formData.skills.length === 0 || !formData.company || !formData.location) {
      setError('Please fill in all required fields (Role Name, Department, Skills, Company, and Location)');
      return;
    }

    if (!formData.salaryMin || !formData.salaryMax) {
      setError('Please provide a valid salary range');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    const salaryRange = `LKR ${formData.salaryMin} - ${formData.salaryMax}`;
    
    const payload = {
      title: formData.roleName,
      company: formData.company,
      location: formData.location,
      description: formData.responsibilities,
      required_skills: formData.skills,
      required_experience: parseInt(formData.required_experience) || 0,
      required_education: formData.minEducation,
      preferred_education: formData.preferredEducation,
      additional_qualifications: formData.qualifications,
      salary_range: salaryRange,
      job_type: formData.jobType,
      remote: formData.isRemote.toString(),
      is_active: formData.status === 'active'
    };
    
    try {
      let updatedJobRoles;
      
      if (formMode === 'add') {
        // Try to submit to backend
        try {
          const response = await api.post("/jobs?code=yfdJdeNoFZzkQynk6p56ZETolRh1NqSpOaBYcTebXJO3AzFuWbJDmQ==", payload);
          console.log('API Response:', response.data);
          
          // Create new job role with the API response ID if available
          const newJobRole = {
            id: response.data?.id || Math.random().toString(36).substr(2, 9),
            ...formData
          };
          updatedJobRoles = [...jobRoles, newJobRole];
        } catch (err) {
          // If API call fails, still add to local state with a generated ID
          console.error('Error adding job role to API:', err);
          const newJobRole = {
            id: Math.random().toString(36).substr(2, 9),
            ...formData
          };
          updatedJobRoles = [...jobRoles, newJobRole];
          setError('Failed to save to server, but job role was saved locally.');
        }
      } else if (formMode === 'edit') {
        // Try to update on backend
        try {
          await api.put(`/jobs/${editingRoleId}?code=yfdJdeNoFZzkQynk6p56ZETolRh1NqSpOaBYcTebXJO3AzFuWbJDmQ==`, payload);
          
          // Update the job in local state
          updatedJobRoles = jobRoles.map(role => 
            role.id === editingRoleId ? { ...formData, id: editingRoleId } : role
          );
        } catch (err) {
          // If API call fails, still update in local state
          console.error('Error updating job role in API:', err);
          updatedJobRoles = jobRoles.map(role => 
            role.id === editingRoleId ? { ...formData, id: editingRoleId } : role
          );
          setError('Failed to update on server, but job role was updated locally.');
        }
      }
      
      // Update local state and localStorage regardless of API result
      setJobRoles(updatedJobRoles);
      saveToLocalStorage(updatedJobRoles);
      
      setFormSubmitted(true);
      resetForm();
      
      setTimeout(() => {
        setFormSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to submit job role. ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRole = (id) => {
    const roleToEdit = jobRoles.find(role => role.id === id);
    if (roleToEdit) {
      setFormData({...roleToEdit});
      setFormMode('edit');
      setEditingRoleId(id);
      
      // Scroll to form section
      document.querySelector('.add-job-role-form').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleDeleteRole = async (id) => {
    // If we're currently editing this role, cancel the edit
    if (editingRoleId === id) {
      resetForm();
    }
    
    setIsLoading(true);
    
    try {
      // Try to delete from backend
      await api.delete(`/jobs/${id}?code=yfdJdeNoFZzkQynk6p56ZETolRh1NqSpOaBYcTebXJO3AzFuWbJDmQ==`);
      
      // Update local state and localStorage
      const updatedRoles = jobRoles.filter(role => role.id !== id);
      setJobRoles(updatedRoles);
      saveToLocalStorage(updatedRoles);
    } catch (err) {
      console.error('Error deleting job role from API:', err);
      
      // If API call fails, still delete from local state
      const updatedRoles = jobRoles.filter(role => role.id !== id);
      setJobRoles(updatedRoles);
      saveToLocalStorage(updatedRoles);
      setError('Failed to delete from server, but job role was removed locally.');
    } finally {
      setIsLoading(false);
    }
  };

  // Available job types
  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Temporary',
    'Internship',
    'Freelance'
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 bg-opacity-70 rounded-xl backdrop-blur-sm shadow-xl p-6 card-3d mb-6 add-job-role-form">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </span>
              {formMode === 'add' ? 'Add New Job Role' : 'Edit Job Role'}
            </h2>
            
            {formSubmitted && (
              <div className="bg-green-500 bg-opacity-20 border border-green-500 rounded-lg p-3 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400 mr-2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span className="text-green-400 text-sm">
                  {formMode === 'add' ? 'Job role has been added successfully!' : 'Job role has been updated successfully!'}
                </span>
              </div>
            )}
            
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-3 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 mr-2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span className="text-red-400 text-sm">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-400 hover:text-red-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            )}
            
            <div>
              {/* Basic Job Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="roleName" className="block text-sm font-medium text-gray-300 mb-1">
                    Job Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="roleName"
                    name="roleName"
                    value={formData.roleName}
                    onChange={handleChange}
                    className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Software Engineer"
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-1">
                    Department <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="IT">Information Technology</option>
                    <option value="HR">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Research">Research & Development</option>
                    <option value="Legal">Legal</option>
                    <option value="Administrative">Administrative</option>
                  </select>
                </div>
              </div>

              {/* Company and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
                    Company Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Tech Innovators Ltd."
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Colombo, Sri Lanka"
                  />
                </div>
              </div>
              
                {/* Salary Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Salary Range (LKR) <span className="text-red-400">*</span>
                  </label>
                  
                  <div className="bg-gray-800 bg-opacity-50 rounded-lg p-5 border border-gray-700">
                    {/* Salary Preset Buttons */}
                    <div className="mb-4">
                      <div className="text-xs text-gray-400 mb-2">Quick Select:</div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          {label: "50-100k", min: 50000, max: 100000},
                          {label: "100-150k", min: 100000, max: 150000},
                          {label: "150-200k", min: 150000, max: 200000},
                          {label: "200-300k", min: 200000, max: 300000},
                          {label: "300-500k", min: 300000, max: 500000},
                          {label: "500k+", min: 500000, max: 1000000}
                        ].map((range) => (
                          <button
                            key={range.label}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              salaryMin: range.min,
                              salaryMax: range.max
                            }))}
                            className={`px-3 py-1 text-xs rounded-full transition-colors ${
                              parseInt(formData.salaryMin) === range.min && parseInt(formData.salaryMax) === range.max
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Interactive Salary Range Display */}
                    <div className="bg-gray-900 bg-opacity-60 rounded-lg p-4 mb-4">
                      <div className="relative h-9 mb-6">
                        {/* Salary Scale Markers */}
                        <div className="absolute w-full flex justify-between text-xs text-gray-500 -mt-3">
                          {[0, 200000, 400000, 600000, 800000, 1000000].map((value) => (
                            <div key={value} className="flex flex-col items-center">
                              <div className="h-2 w-px bg-gray-700"></div>
                              <div className="mt-1">{value === 0 ? '0' : `${value/1000}k`}</div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Range Bar */}
                        <div 
                          className="absolute top-5 w-full h-2 bg-gray-700 rounded-full cursor-pointer"
                          onClick={(e) => {
                            const container = e.currentTarget;
                            const rect = container.getBoundingClientRect();
                            const percent = (e.clientX - rect.left) / rect.width;
                            const value = Math.round(percent * 1000000);
                            
                            // Decide whether to move min or max handle based on which is closer
                            const minDist = Math.abs(value - (parseInt(formData.salaryMin) || 0));
                            const maxDist = Math.abs(value - (parseInt(formData.salaryMax) || 1000000));
                            
                            if (minDist <= maxDist) {
                              // Move min handle, but don't exceed max
                              const newValue = Math.min(value, parseInt(formData.salaryMax) || 1000000);
                              setFormData(prev => ({...prev, salaryMin: newValue}));
                            } else {
                              // Move max handle, but don't go below min
                              const newValue = Math.max(value, parseInt(formData.salaryMin) || 0);
                              setFormData(prev => ({...prev, salaryMax: newValue}));
                            }
                          }}
                        ></div>
                        
                        {/* Selected Range */}
                        <div 
                          className="absolute top-5 h-2 bg-green-600 rounded-full" 
                          style={{ 
                            left: `${Math.min((parseInt(formData.salaryMin) || 0) / 10000, 100)}%`, 
                            width: `${Math.max(((parseInt(formData.salaryMax) || 0) - (parseInt(formData.salaryMin) || 0)) / 10000, 0)}%` 
                          }}
                        ></div>
                        
                        {/* Min Selector */}
                        <div 
                          className="absolute top-[14px] w-6 h-6 flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-md cursor-grab -ml-3 group"
                          style={{ left: `${Math.min((parseInt(formData.salaryMin) || 0) / 10000, 100)}%` }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            
                            // Calculate drag function for the minimum handle
                            const handleMouseMove = (moveEvent) => {
                              const container = e.currentTarget.parentNode;
                              const rect = container.getBoundingClientRect();
                              const percent = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / rect.width));
                              const value = Math.round(percent * 1000000);
                              
                              // Don't allow min to exceed max
                              if (value <= (parseInt(formData.salaryMax) || 1000000)) {
                                setFormData(prev => ({...prev, salaryMin: value}));
                              }
                            };
                            
                            // Handle mouse up to stop dragging
                            const handleMouseUp = () => {
                              document.removeEventListener('mousemove', handleMouseMove);
                              document.removeEventListener('mouseup', handleMouseUp);
                            };
                            
                            document.addEventListener('mousemove', handleMouseMove);
                            document.addEventListener('mouseup', handleMouseUp);
                          }}
                        >
                          <div className="absolute -bottom-8 bg-green-900 text-blue-100 px-2 py-1 rounded text-xs whitespace-nowrap">
                            Min: {(parseInt(formData.salaryMin) || 0).toLocaleString()} LKR
                          </div>
                        </div>
                        
                        {/* Max Selector */}
                        <div 
                          className="absolute top-[14px] w-6 h-6 flex items-center justify-center bg-gradient-to-r from-green-600 to-green-700 rounded-full shadow-md cursor-grab -ml-3 group"
                          style={{ left: `${Math.min((parseInt(formData.salaryMax) || 0) / 10000, 100)}%` }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            
                            // Calculate drag function for the maximum handle
                            const handleMouseMove = (moveEvent) => {
                              const container = e.currentTarget.parentNode;
                              const rect = container.getBoundingClientRect();
                              const percent = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / rect.width));
                              const value = Math.round(percent * 1000000);
                              
                              // Don't allow max to be less than min
                              if (value >= (parseInt(formData.salaryMin) || 0)) {
                                setFormData(prev => ({...prev, salaryMax: value}));
                              }
                            };
                            
                            // Handle mouse up to stop dragging
                            const handleMouseUp = () => {
                              document.removeEventListener('mousemove', handleMouseMove);
                              document.removeEventListener('mouseup', handleMouseUp);
                            };
                            
                            document.addEventListener('mousemove', handleMouseMove);
                            document.addEventListener('mouseup', handleMouseUp);
                          }}
                        >
                          <div className="absolute -bottom-8 bg-green-900 text-blue-100 px-2 py-1 rounded text-xs whitespace-nowrap">
                            Max: {(parseInt(formData.salaryMax) || 0).toLocaleString()} LKR
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Manual Input */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div>
                        <label htmlFor="salaryMin" className="block text-xs font-medium text-gray-400 mb-1">Minimum Salary</label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">LKR</span>
                          </div>
                          <input
                            type="text"
                            inputMode="numeric"
                            id="salaryMin"
                            name="salaryMin"
                            value={formData.salaryMin}
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(/[^0-9]/g, '');
                              const value = rawValue ? parseInt(rawValue) : '';
                              const maxVal = parseInt(formData.salaryMax) || 1000000;
                              setFormData(prev => ({
                                ...prev,
                                salaryMin: value === '' ? '' : (value > maxVal ? maxVal : value)
                              }));
                            }}
                            className="bg-gray-900 border border-gray-700 text-white pl-12 block w-full py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0"
                            style={{appearance: 'textfield'}}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-xs text-gray-500">Min</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="salaryMax" className="block text-xs font-medium text-gray-400 mb-1">Maximum Salary</label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">LKR</span>
                          </div>
                          <input
                            type="text"
                            inputMode="numeric"
                            id="salaryMax"
                            name="salaryMax"
                            value={formData.salaryMax}
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(/[^0-9]/g, '');
                              const value = rawValue ? parseInt(rawValue) : '';
                              const minVal = parseInt(formData.salaryMin) || 0;
                              setFormData(prev => ({
                                ...prev,
                                salaryMax: value === '' ? '' : (value < minVal ? minVal : value)
                              }));
                            }}
                            className="bg-gray-900 border border-gray-700 text-white pl-12 block w-full py-2 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="1000000"
                            style={{appearance: 'textfield'}}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-xs text-gray-500">Max</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Current Selection Display */}
                    <div className="text-center mt-4">
                      <span className="text-sm font-medium text-green-400">
                        Selected Range: {formData.salaryMin && formData.salaryMax ? 
                          `LKR ${parseInt(formData.salaryMin).toLocaleString()} - LKR ${parseInt(formData.salaryMax).toLocaleString()}` : 
                          'Select a salary range'}
                      </span>
                    </div>
                  </div>
                </div>

              {/* Job Type and Remote Option */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-300 mb-1">
                    Job Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="jobType"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center pt-7">
                  <input
                    type="checkbox"
                    id="isRemote"
                    name="isRemote"
                    checked={formData.isRemote}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-700 bg-gray-700 text-green-500 focus:ring-green-500 focus:ring-offset-gray-800"
                  />
                  <label htmlFor="isRemote" className="ml-2 text-sm font-medium text-gray-300">
                    Remote Position
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="required_experience" className="block text-sm font-medium text-gray-300 mb-1">
                    Years of Experience Required
                  </label>
                  <input
                    type="number"
                    id="required_experience"
                    name="required_experience"
                    value={formData.required_experience}
                    onChange={handleChange}
                    min="0"
                    className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 2"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Required Skills <span className="text-red-400">*</span>
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    className="flex-grow bg-gray-800 bg-opacity-50 border border-gray-700 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Add a skill"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.skills.map((skill, index) => (
                      <div 
                        key={index} 
                        className="bg-green-900 bg-opacity-50 px-3 py-1 rounded-full flex items-center"
                      >
                        <span className="text-blue-300 text-sm">{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-blue-300 hover:text-blue-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-300 mb-1">
                  Responsibilities
                </label>
                <textarea
                  id="responsibilities"
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter job responsibilities"
                />
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-green-400 mb-3 border-b border-gray-700 pb-1">Educational Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="minEducation" className="block text-sm font-medium text-gray-300 mb-1">
                      Minimum Education
                      <span className="text-xs text-gray-500 ml-1">(Required)</span>
                    </label>
                    <select
                      id="minEducation"
                      name="minEducation"
                      value={formData.minEducation}
                      onChange={handleChange}
                      className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <optgroup label="High School">
                        {educationByRank[1]?.map(edu => (
                          <option key={`min-${edu}`} value={edu}>{edu.toUpperCase()}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Advanced Level">
                        {educationByRank[2]?.map(edu => (
                          <option key={`min-${edu}`} value={edu}>{edu.toUpperCase()}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Diploma/Associate">
                        {educationByRank[3]?.map(edu => (
                          <option key={`min-${edu}`} value={edu}>{edu.toUpperCase()}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Bachelor's Degree">
                        {educationByRank[4]?.map(edu => (
                          <option key={`min-${edu}`} value={edu}>{edu.toUpperCase()}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Master's Degree">
                        {educationByRank[5]?.map(edu => (
                          <option key={`min-${edu}`} value={edu}>{edu.toUpperCase()}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Doctorate">
                        {educationByRank[6]?.map(edu => (
                          <option key={`min-${edu}`} value={edu}>{edu.toUpperCase()}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="preferredEducation" className="block text-sm font-medium text-gray-300 mb-1">
                      Preferred Education
                      <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                    </label>
                    <select
                      id="preferredEducation"
                      name="preferredEducation"
                      value={formData.preferredEducation}
                      onChange={handleChange}
                      className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">No preference</option>
                      <optgroup label="Bachelor's Degree">
                        {educationByRank[4]?.map(edu => (
                          <option key={`pref-${edu}`} value={edu}>{edu.toUpperCase()}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Master's Degree">
                        {educationByRank[5]?.map(edu => (
                          <option key={`pref-${edu}`} value={edu}>{edu.toUpperCase()}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Doctorate">
                        {educationByRank[6]?.map(edu => (
                          <option key={`pref-${edu}`} value={edu}>{edu.toUpperCase()}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="qualifications" className="block text-sm font-medium text-gray-300 mb-1">
                  Additional Qualifications
                </label>
                <textarea
                  id="qualifications"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter any additional qualifications or certifications required"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-gray-700 mr-3"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : formMode === 'add' ? 'Save Job Role' : 'Update Job Role'}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Job Roles List Section */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 bg-opacity-70 rounded-xl backdrop-blur-sm shadow-xl p-6 card-3d mb-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                  <path d="M12 8v4l3 3"></path>
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"></path>
                </svg>
              </span>
              Job Roles List
            </h2>
            
            {isLoading && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-300">Loading...</span>
              </div>
            )}
            
            {!isLoading && jobRoles.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm">No job roles added yet.</p>
                <p className="text-xs text-gray-600 mt-1">Create your first job role using the form.</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full divide-y divide-gray-800">
                  <thead className="bg-gray-800 bg-opacity-50 sticky top-0 z-10">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role Name</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Department</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {jobRoles.map(role => (
                      <tr
                        key={role.id}
                        className="hover:bg-gray-800 hover:bg-opacity-50 transition-colors"
                        onMouseEnter={() => setHoveredRole(role.id)}
                        onMouseLeave={() => setHoveredRole(null)}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-white truncate max-w-xs">
                          {role.roleName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-white truncate max-w-xs">
                          {role.department}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            role.status === 'active' ? 'bg-green-100 bg-opacity-20 text-green-400' : 
                            role.status === 'draft' ? 'bg-yellow-100 bg-opacity-20 text-yellow-400' :
                            'bg-gray-100 bg-opacity-20 text-gray-400'
                          }`}>
                            {role.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditRole(role.id);
                              }}
                              className="text-green-500 hover:text-green-400"
                              aria-label="Edit job role"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRole(role.id);
                              }}
                              className="text-red-500 hover:text-red-400"
                              aria-label="Delete job role"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Help and Information Panel */}
          <div className="bg-gray-900 bg-opacity-70 rounded-xl backdrop-blur-sm shadow-xl p-6 card-3d">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </span>
              Help Information
            </h3>
            <div className="text-gray-400 text-sm space-y-3">
              <p>Create job roles that will be used to match candidate resumes. These roles define the requirements and qualifications needed.</p>
              <p className="border-t border-gray-800 pt-3 mt-2">Fields marked with <span className="text-red-400">*</span> are required.</p>
              <p>
                <strong className="text-green-300">Note:</strong> Job roles are saved to both the server and locally. If the server is unavailable, your changes will be saved locally and synchronized when the connection is restored.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobRolePanel;