import React from 'react';
import { ArrowLeft, Upload } from 'react-feather';


const ApplyPage = ({ currentPage, selectedJob, handleBackClick, handleSubmit, handleInputChange, handleFileChange, formData }) => {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (currentPage === 'apply' && selectedJob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Modern 3D Back Button */}
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
                Back to Job Details
              </span>
            </div>
            
            {/* Edge highlight for 3D effect */}
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Apply for {selectedJob.title}</h1>
            <p className="text-gray-600 mb-6">{selectedJob.company} · {selectedJob.location}</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your phone number (optional)"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="cv">Upload CV/Resume</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="cv"
                    name="cv"
                    onChange={handleFileChange}
                    required
                    className="hidden"
                  />
                  <label htmlFor="cv" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <Upload size={32} className="text-gray-400 mb-2" />
                      <span className="text-gray-600 mb-1">
                        {formData.cv ? formData.cv : "Click to upload your CV/Resume"}
                      </span>
                      <span className="text-gray-400 text-sm">PDF or Word document (5MB max)</span>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="coverLetter">Cover Letter (Optional)</label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tell us why you're a good fit for this position"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg transform transition-all hover:bg-indigo-700 hover:scale-105 hover:shadow-xl"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default ApplyPage;