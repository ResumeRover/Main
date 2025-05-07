import React, { useState } from 'react';

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
    experienceLevel: 'entry',
    skills: [],
    minEducation: 'bsc', // Default minimum education requirement
    preferredEducation: 'msc', // Default preferred education
    responsibilities: '',
    qualifications: '',
    status: 'active'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [currentSkill, setCurrentSkill] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [jobRoles, setJobRoles] = useState([]);
  const [hoveredRole, setHoveredRole] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
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
  };

  const handleCancel = () => {
    resetForm();
  };
  
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (formMode === 'add') {
      // Add to job roles list
      setJobRoles(prevRoles => [...prevRoles, { ...formData, id: Date.now() }]);
      setFormSubmitted(true);
      
      // Reset submission message after 3 seconds
      setTimeout(() => {
        setFormSubmitted(false);
      }, 3000);
    } else if (formMode === 'edit' && editingRoleId) {
      // Update existing job role
      setJobRoles(prevRoles => 
        prevRoles.map(role => 
          role.id === editingRoleId ? { ...formData, id: editingRoleId } : role
        )
      );
      setFormSubmitted(true);
      
      // Reset submission message after 3 seconds
      setTimeout(() => {
        setFormSubmitted(false);
      }, 3000);
    }
    
    // Reset form
    resetForm();
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

  const handleDeleteRole = (id) => {
    // If we're currently editing this role, cancel the edit
    if (editingRoleId === id) {
      resetForm();
    }
    
    setJobRoles(prevRoles => prevRoles.filter(role => role.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 bg-opacity-70 rounded-xl backdrop-blur-sm shadow-xl p-6 card-3d mb-6 add-job-role-form">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
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
            
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="roleName" className="block text-sm font-medium text-gray-300 mb-1">
                    Role Name
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
                

              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-300 mb-1">
                    Experience Level
                  </label>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="lead">Lead/Manager</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-1">
                    Department
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
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Required Skills
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    className="flex-grow bg-gray-800 bg-opacity-50 border border-gray-700 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.skills.map((skill, index) => (
                      <div 
                        key={index} 
                        className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full flex items-center"
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
                  className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter job responsibilities"
                />
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-blue-400 mb-3 border-b border-gray-700 pb-1">Educational Requirements</h3>
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
                      className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter any additional qualifications or certifications required"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-gray-700 mr-3"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm transition-colors"
                >
                  {formMode === 'add' ? 'Save Job Role' : 'Update Job Role'}
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
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                  <path d="M12 8v4l3 3"></path>
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"></path>
                </svg>
              </span>
              Job Roles List
            </h2>
            
            {jobRoles.length === 0 ? (
              <div className="text-center text-gray-400">No job roles added yet.</div>
            ) : (
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full divide-y divide-gray-800">
                  <thead className="bg-gray-800 bg-opacity-50 sticky top-0 z-10">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role Name</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Department</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Experience</th>
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
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                          {role.experienceLevel}
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
                              className="text-blue-500 hover:text-blue-400"
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
        </div>
      </div>
    </div>
  );
}

export default JobRolePanel;