import React, { useContext, useState, useEffect } from "react";
import {
  Search,
  ArrowRight,
  FileText,
  Users,
  Star,
  Briefcase,
  ChevronRight,
  Award,
  Bookmark,
  Clock,
  Zap,
} from "react-feather";
import { ThemeContext } from "./ThemeContext";
import ThemeToggle from "./ThemeToggle";
import { LogIn, Menu } from "react-feather";
import { Info, Home } from "react-feather";
import img from "../public/assests/logox.png"

// Animation for skills
const skills = [
  "React",
  "JavaScript",
  "Python",
  "UI/UX",
  "Data Science",
  "Java",
  "C++",
  "Node.js",
  "DevOps",
];

const HomePage = ({ currentPage, setCurrentPage }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [activeSkill, setActiveSkill] = useState(0);
  const [stats, setStats] = useState({ companies: 0, jobs: 0, candidates: 0 });

  // Animate stats counting
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => {
        return {
          companies: prev.companies >= 500 ? 500 : prev.companies + 5,
          jobs: prev.jobs >= 10000 ? 10000 : prev.jobs + 100,
          candidates: prev.candidates >= 25000 ? 25000 : prev.candidates + 250,
        };
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Rotate through skills
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSkill((prev) => (prev + 1) % skills.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (currentPage === "home") {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDarkMode
            ? "bg-gray-900 text-white"
            : "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900"
        }`}
      >
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
        {/* Hero Section */}
        <header className="container mx-auto px-6 pt-32 pb-16 text-center">
          <div className="animate-float inline-block mb-3 py-1 px-3 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 text-sm font-medium">
            AI-Powered Job Matching
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your Career Journey <br className="hidden md:block" />
            <span
              className={`${
                isDarkMode ? "text-primary-400" : "text-primary-600"
              } relative`}
            >
              Starts Here
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-primary-300 dark:text-primary-700 opacity-50"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,0 Q50,12 100,0"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            Connect with top employers and discover opportunities that match
            your
            <span className="relative inline-block mx-2 px-2 py-1 font-semibold text-primary-800 dark:text-primary-200">
              <span className="relative z-10">{skills[activeSkill]}</span>
              <span
                className={`absolute inset-0 bg-primary-100 dark:bg-primary-900 rounded transition-all duration-300`}
              ></span>
            </span>
            skills.
          </p>
          {/* Enhanced 3D Search Bar - Original Centered Placement */}
          <div className="max-w-2xl mx-auto mb-10 relative">
            <div className="relative group transition-all duration-300">
              {/* Outer glow container */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/40 to-secondary-500/40 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105 animate-rotate-slow"></div>
              
              {/* 3D effect container */}
              <div className={`relative rounded-full ${
                isDarkMode 
                  ? "shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5),0_-3px_8px_-4px_rgba(82,109,130,0.2)_inset,0_-1px_0_0_rgba(255,255,255,0.1)_inset]" 
                  : "shadow-[0_10px_20px_-10px_rgba(0,0,0,0.15),0_-3px_8px_-4px_rgba(82,109,130,0.15)_inset,0_-1px_0_0_rgba(255,255,255,0.7)_inset]"
              } transition-all duration-300 before:absolute before:inset-0 before:rounded-full before:p-[1px] before:bg-gradient-to-r before:from-primary-400/30 before:via-secondary-400/30 before:to-primary-400/30 group-hover:before:from-primary-400/70 group-hover:before:via-secondary-400/70 group-hover:before:to-primary-400/70 before:transition-all`}>
                
                {/* Main input container with 3D effect */}
                <div className={`relative rounded-full ${
                  isDarkMode
                    ? "bg-gradient-to-b from-gray-800 to-gray-900"
                    : "bg-gradient-to-b from-white to-gray-50"
                } overflow-hidden p-[1px]`}>
                  
                  {/* Search icon with animated glow */}
                  <div className="absolute left-4 top-4 transform -translate-y-1/2 z-10">
                    <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse-slow"></div>
                    <Search
                      className={`relative transition-all duration-300 ${
                        isDarkMode ? "text-gray-400 group-hover:text-primary-400" : "text-gray-400 group-hover:text-primary-600"
                      }`}
                      size={20}
                    />
                  </div>
                  
                  {/* Search input */}
                  <input
                    type="text"
                    placeholder="Search for jobs, companies, or skills..."
                    className={`w-full py-4 pl-12 pr-36 rounded-full border-0 ${
                      isDarkMode
                        ? "bg-transparent text-white placeholder-gray-400"
                        : "bg-transparent text-gray-800 placeholder-gray-500"
                    } focus:outline-none focus:ring-0 transition-all relative z-0`}
                  />
                  
                  {/* 3D Search button with hover effects */}
                  <button className="absolute right-2 top-1 transform -translate-y-1/2 px-6 py-2.5 rounded-full transition-all duration-300 bg-gradient-to-r from-primary-600 to-secondary-600 text-black font-medium hover:shadow-[0_0_15px_rgba(var(--color-primary-500),0.5)] group-hover:scale-105">
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-600/80 to-secondary-600/80 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center justify-center">
                      <span>Search</span>
                      <ArrowRight size={16} className="ml-1.5 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </div>
              </div>
              
              {/* Floating particles for enhanced 3D effect (optional) */}
              <div className="hidden group-hover:block absolute -right-2 -top-2 w-3 h-3 rounded-full bg-primary-400/50 blur-sm animate-float-slow"></div>
              <div className="hidden group-hover:block absolute -left-3 bottom-2 w-2 h-2 rounded-full bg-secondary-400/50 blur-sm animate-float-slow-reverse"></div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setCurrentPage("jobs")}
            className="group px-8 py-4 bg-primary-600 dark:bg-primary-500 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-all flex items-center mx-auto"
          >
            Browse All Jobs
            <ArrowRight
              className="ml-2 group-hover:translate-x-1 transition-transform"
              size={18}
            />
          </button>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className={`p-6 rounded-xl ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-md`}
            >
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                {stats.companies.toLocaleString()}+
              </div>
              <div
                className={`text-lg ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Hiring Companies
              </div>
            </div>
            <div
              className={`p-6 rounded-xl ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-md`}
            >
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                {stats.jobs.toLocaleString()}+
              </div>
              <div
                className={`text-lg ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Active Job Listings
              </div>
            </div>
            <div
              className={`p-6 rounded-xl ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-md`}
            >
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                {stats.candidates.toLocaleString()}+
              </div>
              <div
                className={`text-lg ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Placed Candidates
              </div>
            </div>
          </div>
        </header>

        {/* Featured Jobs */}
        <section className={`py-16 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold">Featured Opportunities</h2>
              <button
                onClick={() => setCurrentPage("jobs")}
                className="flex items-center text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                View all jobs <ChevronRight size={16} className="ml-1" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  id: 1,
                  title: "Senior React Developer",
                  company: "TechGiant",
                  location: "Remote",
                  salary: "$120K - $150K",
                  tags: ["React", "TypeScript", "Remote"],
                },
                {
                  id: 2,
                  title: "UX/UI Designer",
                  company: "Creative Studios",
                  location: "New York, NY",
                  salary: "$90K - $110K",
                  tags: ["Figma", "User Research", "Hybrid"],
                },
                {
                  id: 3,
                  title: "Data Scientist",
                  company: "Analytics Inc",
                  location: "San Francisco, CA",
                  salary: "$130K - $160K",
                  tags: ["Python", "ML", "Onsite"],
                },
              ].map((job) => (
                <div
                  key={job.id}
                  className={`group p-6 rounded-xl border ${
                    isDarkMode
                      ? "bg-gray-900 border-gray-700 hover:border-primary-600"
                      : "bg-gray-50 border-gray-200 hover:border-primary-400"
                  } cursor-pointer transition-all duration-300 hover:shadow-lg`}
                  onClick={() => {
                    setCurrentPage("jobs");
                    // In a real app, you would navigate to specific job
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {job.title}
                    </h3>
                    <button className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                      <Bookmark size={18} />
                    </button>
                  </div>
                  <p
                    className={`mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {job.company} • {job.location}
                  </p>
                  <p className="font-medium mb-4">{job.salary}</p>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-3 py-1 rounded-full ${
                          isDarkMode
                            ? "bg-gray-800 text-primary-400"
                            : "bg-primary-100 text-primary-800"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className={`container mx-auto px-6 py-16 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <h2 className="text-3xl font-bold text-center mb-16">
            Why Choose ResumeRover
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="relative">
              <div
                className={`absolute top-0 left-0 w-12 h-12 rounded-xl ${
                  isDarkMode ? "bg-primary-900" : "bg-primary-100"
                } flex items-center justify-center`}
              >
                <Zap
                  className="text-primary-600 dark:text-primary-400"
                  size={24}
                />
              </div>
              <div className="pl-20">
                <h3 className="text-xl font-bold mb-3">AI-Powered Matching</h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Our advanced AI algorithm analyzes your skills, experience,
                  and preferences to match you with the perfect opportunities.
                </p>
              </div>
            </div>

            <div className="relative">
              <div
                className={`absolute top-0 left-0 w-12 h-12 rounded-xl ${
                  isDarkMode ? "bg-primary-900" : "bg-primary-100"
                } flex items-center justify-center`}
              >
                <FileText
                  className="text-primary-600 dark:text-primary-400"
                  size={24}
                />
              </div>
              <div className="pl-20">
                <h3 className="text-xl font-bold mb-3">Resume Analysis</h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Get personalized feedback on your resume and suggestions to
                  improve your chances of landing interviews.
                </p>
              </div>
            </div>

            <div className="relative">
              <div
                className={`absolute top-0 left-0 w-12 h-12 rounded-xl ${
                  isDarkMode ? "bg-primary-900" : "bg-primary-100"
                } flex items-center justify-center`}
              >
                <Award
                  className="text-primary-600 dark:text-primary-400"
                  size={24}
                />
              </div>
              <div className="pl-20">
                <h3 className="text-xl font-bold mb-3">
                  Premium Employer Network
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Access exclusive job opportunities from our network of
                  verified top-tier employers.
                </p>
              </div>
            </div>

            <div className="relative">
              <div
                className={`absolute top-0 left-0 w-12 h-12 rounded-xl ${
                  isDarkMode ? "bg-primary-900" : "bg-primary-100"
                } flex items-center justify-center`}
              >
                <Users
                  className="text-primary-600 dark:text-primary-400"
                  size={24}
                />
              </div>
              <div className="pl-20">
                <h3 className="text-xl font-bold mb-3">Career Coaching</h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  One-on-one sessions with industry experts who can guide your
                  career path and interview preparation.
                </p>
              </div>
            </div>

            <div className="relative">
              <div
                className={`absolute top-0 left-0 w-12 h-12 rounded-xl ${
                  isDarkMode ? "bg-primary-900" : "bg-primary-100"
                } flex items-center justify-center`}
              >
                <Star
                  className="text-primary-600 dark:text-primary-400"
                  size={24}
                />
              </div>
              <div className="pl-20">
                <h3 className="text-xl font-bold mb-3">Skill Development</h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Access tailored courses and resources to help you develop the
                  skills employers are looking for.
                </p>
              </div>
            </div>

            <div className="relative">
              <div
                className={`absolute top-0 left-0 w-12 h-12 rounded-xl ${
                  isDarkMode ? "bg-primary-900" : "bg-primary-100"
                } flex items-center justify-center`}
              >
                <Clock
                  className="text-primary-600 dark:text-primary-400"
                  size={24}
                />
              </div>
              <div className="pl-20">
                <h3 className="text-xl font-bold mb-3">Real-time Updates</h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Get instant notifications about new job postings that match
                  your profile and application status.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section
          id="testimonials"
          className={`py-16 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">
              Success Stories
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Frontend Developer at Google",
                  photo: "https://randomuser.me/api/portraits/women/44.jpg",
                  text: "ResumeRover completely transformed my job search. The AI matching helped me find opportunities I wouldn't have discovered otherwise, and I landed my dream job in just 3 weeks!",
                },
                {
                  name: "Michael Chen",
                  role: "Data Analyst at Amazon",
                  photo: "https://randomuser.me/api/portraits/men/32.jpg",
                  text: "The resume feedback feature was a game-changer. After implementing the suggested changes, I started getting calls for interviews almost immediately. Now I'm working at a company I love.",
                },
                {
                  name: "Priya Sharma",
                  role: "UX Designer at Adobe",
                  photo: "https://randomuser.me/api/portraits/women/63.jpg",
                  text: "The personalized job matches and career coaching helped me pivot into UX design from a completely different field. I couldn't be happier with my career transition!",
                },
              ].map((testimonial) => (
                <div
                  key={testimonial.name}
                  className={`p-8 rounded-xl ${
                    isDarkMode ? "bg-gray-900" : "bg-white"
                  } shadow-lg`}
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.photo}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h3 className="font-bold">{testimonial.name}</h3>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    "{testimonial.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-16">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Is ResumeRover completely free to use?",
                answer:
                  "ResumeRover offers both free and premium plans. The basic job search and application features are free, while advanced features like AI resume analysis, career coaching, and priority applications are available in our premium plans.",
              },
              {
                question: "How does the AI matching algorithm work?",
                answer:
                  "Our AI analyzes your resume, skills, experience, and preferences, then compares them to millions of job postings to find the most relevant matches. It also considers company culture and your career goals to ensure a good fit.",
              },
              {
                question:
                  "Can I use ResumeRover if I'm looking to change careers?",
                answer:
                  "Absolutely! ResumeRover is especially helpful for career changers. Our AI can identify transferable skills and match you with opportunities in your desired field, while our career coaches can provide guidance on the transition.",
              },
              {
                question: "How do employers verify my application?",
                answer:
                  "When you apply through ResumeRover, employers receive your verified profile along with your application. This includes your verified skills, experience, and other credentials, making the hiring process more efficient.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <h3 className="text-xl font-medium mb-3">{faq.question}</h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section
          className={`py-16 ${isDarkMode ? "bg-gray-800" : "bg-primary-50"}`}
        >
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Find Your Dream Job?
            </h2>
            <p
              className={`text-xl mb-8 max-w-2xl mx-auto ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Join thousands of professionals who've found their perfect career
              match with ResumeRover.
            </p>
            <button
              onClick={() => setCurrentPage("jobs")}
              className="px-8 py-4 bg-primary-600 dark:bg-primary-500 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-all"
            >
              Get Started Now
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer
          className={`py-12 ${
            isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-800 text-white"
          }`}
        >
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center space-x-2 mb-6">
                  <Briefcase className="text-primary-400" size={24} />
                  <span className="text-xl font-bold">ResumeRover</span>
                </div>
                <p className="text-gray-400 max-w-xs mb-6">
                  Connecting talented individuals with their dream careers
                  through AI-powered job matching and career support.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-primary-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-primary-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-primary-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-6">For Job Seekers</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      Browse Jobs
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      Career Resources
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      Resume Builder
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      Salary Calculator
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-6">For Employers</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      Post a Job
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      Talent Search
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      Recruiting Solutions
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-6">Company</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      Press
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                &copy; 2023 ResumeRover. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
  return null;
};

export default HomePage;
