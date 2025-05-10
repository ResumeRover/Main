import React, { useState, useContext } from 'react';
import { ArrowLeft, Upload, CheckCircle } from 'react-feather';
import axios from 'axios';
import { ThemeContext } from './ThemeContext';

const ApplyPage = ({ currentPage, selectedJob, handleBackClick, handleSubmit: parentHandleSubmit, setCurrentPage, formData, setFormData }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [localFormData, setLocalFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: ''
  });

  // Use local form state instead of parent state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size exceeds 5MB limit');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate form data
      if (!localFormData.fullName || !localFormData.email || !selectedFile) {
        throw new Error('Please fill in all required fields and upload your CV');
      }
      
      // Create form data for file upload
      const applicationData = new FormData();
      applicationData.append('job_id', selectedJob.id);  // Make sure key is 'job_id'
      applicationData.append('file', selectedFile);
      
      // Submit application to backend - using the correct endpoint path
      // The correct endpoint should be /jobs/{job_id}/apply 
      const response = await axios.post(
        `https://resumeparserjobscs3023.azurewebsites.net/api/jobs/${selectedJob.id}/apply?code=yfdJdeNoFZzkQynk6p56ZETolRh1NqSpOaBYcTebXJO3AzFuWbJDmQ==`,
        applicationData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      console.log('Application submitted successfully:', response.data);
      
      // If successful, show success message then redirect
      setSubmissionSuccess(true);
      
      // Call parent handler if needed
      if (parentHandleSubmit) {
        parentHandleSubmit(e);
      } else {
        // Wait 2 seconds before redirecting to success page
        setTimeout(() => {
          setCurrentPage('success');
        }, 2000);
      }
    } catch (err) {
      console.error('Application submission error:', err);
      console.log('Error response:', err.response);
      let errorMessage = 'Failed to submit application';
      
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = 'Application submission endpoint not found. Please try again later.';
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentPage === 'apply' && selectedJob) {
    // Show success animation instead of form if submission was successful
    if (submissionSuccess) {
      return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'} p-4 md:p-8 flex items-center justify-center`}>
          <div className="max-w-md w-full mx-auto text-center">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-green-600' : 'bg-green-500'}`}>
              <CheckCircle size={40} className="text-white animate-[scale_0.5s_ease-in-out]" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
            <p className={`mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Your application for {selectedJob.title} at {selectedJob.company} has been successfully submitted.
            </p>
            <div className="animate-pulse">Redirecting to confirmation page...</div>
          </div>
        </div>
      );
    }
    
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'} p-4 md:p-8`}>
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={handleBackClick} 
            className="group relative px-4 py-2.5 rounded-lg overflow-hidden transition-all duration-300 mb-6"
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
                Back to Job Details
              </span>
            </div>
            
            {/* Edge highlight for 3D effect */}
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <div className={`rounded-2xl shadow-lg p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
              Apply for {selectedJob.title}
            </h1>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              {selectedJob.company} · {selectedJob.location}
            </p>
            
            {/* Error message */}
            {error && (
              <div className={`mb-6 p-4 rounded-lg border ${
                isDarkMode ? 'bg-red-900/30 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-600'
              }`}>
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}
            
            <form onSubmit={submitApplication}>
              <div className="mb-6">
                <label className={`block ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium mb-2`} htmlFor="fullName">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={localFormData.fullName}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500' 
                      : 'bg-white border-gray-300 focus:ring-primary-500'
                  } focus:outline-none focus:ring-2`}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="mb-6">
                <label className={`block ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium mb-2`} htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={localFormData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500' 
                      : 'bg-white border-gray-300 focus:ring-primary-500'
                  } focus:outline-none focus:ring-2`}
                  placeholder="Enter your email address"
                />
              </div>
              
              <div className="mb-6">
                <label className={`block ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium mb-2`} htmlFor="phone">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={localFormData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500' 
                      : 'bg-white border-gray-300 focus:ring-primary-500'
                  } focus:outline-none focus:ring-2`}
                  placeholder="Enter your phone number (optional)"
                />
              </div>
              
              <div className="mb-6">
                <label className={`block ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium mb-2`} htmlFor="cv">
                  Upload CV/Resume <span className="text-red-500">*</span>
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50' 
                    : 'border-gray-300 bg-gray-50/50'
                }`}>
                  <input
                    type="file"
                    id="cv"
                    name="cv"
                    onChange={handleFileChange}
                    required
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <label htmlFor="cv" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <Upload size={32} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                      <span className={`mb-1 mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {selectedFile ? selectedFile.name : "Click to upload your CV/Resume"}
                      </span>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        PDF or Word document (5MB max)
                      </span>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="mb-8">
                <label className={`block ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium mb-2`} htmlFor="coverLetter">
                  Cover Letter (Optional)
                </label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={localFormData.coverLetter}
                  onChange={handleInputChange}
                  rows="5"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500' 
                      : 'bg-white border-gray-300 focus:ring-primary-500'
                  } focus:outline-none focus:ring-2`}
                  placeholder="Tell us why you're a good fit for this position"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-bold shadow-lg transform transition-all ${
                  isDarkMode
                    ? 'bg-primary-600 hover:bg-primary-700'
                    : 'bg-primary-600 hover:bg-primary-700'
                } text-white ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Application...
                  </span>
                ) : (
                  'Submit Application'
                )}
              </button>
              
              <p className={`text-center mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                By submitting this application, you agree to our privacy policy and terms of service.
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default ApplyPage;