import React, { useState, useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import HomePage from './HomePage';
import Jobs from './Jobs';
import JobDetailsPage from './JobDetailsPage';
import ApplyPage from './ApplyPage';
import SuccessPage from './SuccessPage';
import ThemeToggle from './ThemeToggle';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import About from './About';
import Companies from './Companies';


function App() {
  const { isDarkMode } = useContext(ThemeContext);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cv: null,
    coverLetter: ''
  });
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = (page, job = null) => {
    switch(page) {
      case 'home':
        navigate('/');
        break;
      case 'jobs':
        navigate('/jobs');
        break;
      case 'jobDetails':
        navigate(`/jobs/${job.id}`, { state: { job } });
        break;
      case 'apply':
        navigate(`/jobs/${job.id}/apply`, { state: { job } });
        break;
      case 'success':
        navigate('/success');
        break;
      default:
        navigate('/');
    }
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    navigateTo('jobDetails', job);
  };

  const handleBackClickFromDetails = () => {
    navigateTo('jobs');
  };

  const handleApplyClick = () => {
    if (selectedJob) {
      navigateTo('apply', selectedJob);
    }
  };

  const handleBackClickFromApply = () => {
    navigateTo('jobDetails', selectedJob);
  };

  const handleBackClick = () => {
    if (currentPage === 'jobs') {
      setCurrentPage('home');
    } else if (currentPage === 'job-details') {
      setCurrentPage('jobs');
    } else if (currentPage === 'apply') {
      setCurrentPage('job-details');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0].name }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Application submitted:", formData);
    setCurrentPage('success');
  };

  const handleSubmitApplication = () => {
    navigateTo('success');
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
    <Routes>
      <Route path="/" element={<HomePage setCurrentPage={navigateTo} />} />

      <Route 
        path="/jobs" 
        element={<Jobs 
          currentPage="jobs"
          // JOBS={JOBS} 
          handleJobClick={handleJobClick} 
          handleBackClick={() => navigateTo('home')}
          setCurrentPage={navigateTo}
        />} 
      />

      <Route 
        path="/jobs/:jobId" 
        element={<JobDetailsPage 
          currentPage="jobDetails"
          selectedJob={selectedJob || location.state?.job}
          handleBackClick={handleBackClickFromDetails}
          handleApplyClick={handleApplyClick}
        />} 
      />


      <Route 
        path="/jobs/:jobId/apply" 
        element={<ApplyPage 
          currentPage="apply"
          selectedJob={selectedJob || location.state?.job}
          handleBackClick={handleBackClickFromApply}
          handleSubmit={handleSubmitApplication}
          setCurrentPage={navigateTo}
        />} 
      />

      <Route 
        path="/success" 
        element={<SuccessPage 
          currentPage="success"
          setCurrentPage={navigateTo}
        />} 
      />

      <Route path="/companies" element={<Companies />} />
      <Route path="/about" element={<About />} />

      </Routes>
    </div>
  );
}

export default App;