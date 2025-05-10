import React, { useState, useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import HomePage from './HomePage';
import Jobs from './Jobs';
import JobDetailsPage from './JobDetailsPage';
import ApplyPage from './ApplyPage';
import SuccessPage from './SuccessPage';
import ThemeToggle from './ThemeToggle';

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
      "Collaborate with the marketing team to develop content strategies"
    ]
  }
];

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

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setCurrentPage('job-details');
  };

  const handleApplyClick = () => {
    setCurrentPage('apply');
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

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <HomePage 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
      />
      <Jobs 
        currentPage={currentPage} 
        JOBS={JOBS} 
        handleJobClick={handleJobClick} 
        handleBackClick={handleBackClick} 
        setCurrentPage={setCurrentPage} 
      />
      <JobDetailsPage 
        currentPage={currentPage} 
        selectedJob={selectedJob} 
        handleBackClick={handleBackClick} 
        handleApplyClick={handleApplyClick} 
      />
      <ApplyPage 
        currentPage={currentPage} 
        selectedJob={selectedJob} 
        handleBackClick={handleBackClick} 
        handleSubmit={handleSubmit} 
        handleInputChange={handleInputChange} 
        handleFileChange={handleFileChange} 
        formData={formData}
      />
      <SuccessPage 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
      />
    </div>
  );
}

export default App;