import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { 
  Info, 
  Users, 
  CheckCircle, 
  Target, 
  Star,
  Mail,
  MapPin,
  Phone,
  Briefcase,
  Calendar,
  Home
} from "react-feather";
import { ThemeContext } from "./ThemeContext";
import img from "/logox.png";

// Team Members Data - Replace with your actual team information
const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "CEO & Co-Founder",
    bio: "Former tech executive with over 15 years of experience in the recruitment industry. Founded ResumeRover to revolutionize how talent and opportunities connect.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Sophia Williams",
    role: "CTO",
    bio: "AI specialist with background in machine learning and natural language processing. Leads our technology innovations and AI-powered matching algorithms.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Marcus Chen",
    role: "Head of Product",
    bio: "Former product leader at top job platforms. Passionate about creating intuitive user experiences that help candidates find their dream careers.",
    avatar: "https://randomuser.me/api/portraits/men/68.jpg",
  },
  {
    id: 4,
    name: "Emma Rodriguez",
    role: "Director of Employer Relations",
    bio: "With expertise in corporate recruitment, Emma builds partnerships with top employers and ensures our platform meets their hiring needs.",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  }
];

// Values data
const VALUES = [
  {
    id: 1,
    title: "Innovation",
    description: "We constantly push boundaries to create cutting-edge solutions for the job search process.",
    icon: <Star className="text-primary-400" size={24} />
  },
  {
    id: 2,
    title: "Opportunity for All",
    description: "We believe everyone deserves access to meaningful career opportunities that match their potential.",
    icon: <Users className="text-primary-400" size={24} />
  },
  {
    id: 3,
    title: "Data-Driven Decisions",
    description: "We leverage data and AI responsibly to create the most effective matches between talent and opportunities.",
    icon: <Target className="text-primary-400" size={24} />
  },
  {
    id: 4,
    title: "Candidate Success",
    description: "We measure our success by the career advancements and job satisfaction of our candidates.",
    icon: <CheckCircle className="text-primary-400" size={24} />
  }
];

// Timeline/History data
const HISTORY = [
  {
    year: "2020",
    title: "ResumeRover Founded",
    description: "Started as a small AI-powered resume analysis tool to help job seekers improve their applications."
  },
  {
    year: "2021",
    title: "First Major Partnerships",
    description: "Partnered with 50+ companies and expanded our platform to include job listings and intelligent matching."
  },
  {
    year: "2022",
    title: "Platform Expansion",
    description: "Launched ResumeRover 2.0 with advanced AI matching, career resources, and employer tools."
  },
  {
    year: "2023",
    title: "Global Growth",
    description: "Expanded to international markets with localized platforms and surpassed 1 million users worldwide."
  }
];

const About = () => {
  const { isDarkMode } = useContext(ThemeContext);

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
          {/* Logo */}
          <div className="flex items-center">
            <div className="relative group overflow-hidden">
              <Link to="/">
                <div
                  className={`relative z-10 flex items-center justify-center space-x-3 px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? "bg-gray-100/60 backdrop-blur-sm border-gray-700/40" 
                      : "bg-white/80 backdrop-blur-sm border-gray-200/40"
                  } transition-all duration-300`}
                >
                  <div className="flex items-center justify-center w-full h-10">
                    <div className="relative">
                      <img
                        src={img}
                        alt="Logo"
                        className="relative h-10 w-30 rounded-full z-10 drop-shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Home Link */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-violet-500/0 rounded-lg blur-md group-hover:via-primary-500/20 transition-all duration-300"></div>
              <Link
                to="/"
                className={`relative font-medium text-base px-1.5 py-1 transition-all duration-300 
                  ${isDarkMode ? "text-gray-300" : "text-gray-700"}
                  group-hover:text-primary-500 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 
                  after:bg-gradient-to-r after:from-primary-500 after:to-violet-500 
                  after:transition-all after:duration-300 group-hover:after:w-full`}
              >
                <span className="relative">
                  <span className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary-500/10 to-violet-500/10 blur-sm transition-all duration-300"></span>
                  <span className="relative inline-flex items-center">
                    <Home size={16} className="mr-1.5 opacity-80" />
                    Home
                  </span>
                </span>
              </Link>
            </div>

            {/* Jobs Link */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-violet-500/0 rounded-lg blur-md group-hover:via-primary-500/20 transition-all duration-300"></div>
              <Link
                to="/jobs"
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
              </Link>
            </div>

            {/* Companies Link */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-violet-500/0 rounded-lg blur-md group-hover:via-primary-500/20 transition-all duration-300"></div>
              <Link
                to="/companies"
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
              </Link>
            </div>

            {/* About Link - Active */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/10 via-primary-500/20 to-violet-500/10 rounded-lg blur-md"></div>
              <Link
                to="/about"
                className={`relative font-medium text-base px-3 py-1.5 transition-all duration-300 
                  text-primary-500 rounded-lg
                  ${isDarkMode ? "bg-gray-800/50" : "bg-white/50"} 
                  shadow-sm after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full 
                  after:bg-gradient-to-r after:from-primary-500 after:to-violet-500`}
              >
                <span className="relative">
                  <span className="absolute -inset-1 rounded-lg opacity-30 bg-gradient-to-r from-primary-500/10 to-violet-500/10 blur-sm animate-pulse-slow"></span>
                  <span className="relative inline-flex items-center">
                    <Info size={16} className="mr-1.5" />
                    About
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32">
        {/* Hero Section */}
        <div className="container mx-auto px-6 mb-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className={isDarkMode ? "text-white" : "text-gray-900"}>About </span>
              <span className={`${isDarkMode ? "text-primary-400" : "text-primary-600"} relative`}>
                ResumeRover
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
            <p className="text-xl max-w-3xl mx-auto mt-6 text-gray-600 dark:text-gray-300">
              We're on a mission to revolutionize the job search experience by connecting the right talent with the right opportunities using AI-powered matching.
            </p>
          </div>

          <div className={`rounded-2xl overflow-hidden shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} grid md:grid-cols-2`}>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-block mb-4 py-1 px-3 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 text-sm font-medium">
                Our Story
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Transforming How People Find Their Dream Jobs</h2>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                ResumeRover was founded in 2020 with a clear vision: to eliminate the frustration and inefficiency in the job search process. Our founders experienced firsthand the challenges of traditional job searching – endless applications, mismatched opportunities, and lack of feedback.
              </p>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                We've built an intelligent platform that leverages artificial intelligence to analyze both candidate qualifications and job requirements, creating matches that truly work for both sides of the hiring equation.
              </p>
            </div>
            <div className={`hidden md:block bg-primary-600 relative min-h-[400px]`}>
              {/* This would be replaced with an actual image in production */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-lg font-medium">Company Image Here</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Our Values */}
        <div className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-block mb-3 py-1 px-3 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 text-sm font-medium">
                Our Values
              </div>
              <h2 className="text-3xl font-bold mb-4">What Drives Us Forward</h2>
              <p className={`max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Our core values shape everything we do and every decision we make as we work to transform the job search experience.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {VALUES.map(value => (
                <div 
                  key={value.id}
                  className={`p-6 rounded-xl ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  } transition-all duration-300 hover:shadow-lg`}
                >
                  <div className="mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Team Section */}
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <div className="inline-block mb-3 py-1 px-3 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 text-sm font-medium">
              Our Team
            </div>
            <h2 className="text-3xl font-bold mb-4">Meet the People Behind ResumeRover</h2>
            <p className={`max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Our diverse team brings together expertise in AI, recruiting, product design, and career development.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM_MEMBERS.map(member => (
              <div 
                key={member.id}
                className={`rounded-xl overflow-hidden ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-lg transition-all duration-300 hover:shadow-xl group`}
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className={`text-sm font-medium mb-4 ${
                    isDarkMode ? 'text-primary-400' : 'text-primary-600'
                  }`}>
                    {member.role}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Our History/Timeline */}
        <div className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-block mb-3 py-1 px-3 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 text-sm font-medium">
                Our Journey
              </div>
              <h2 className="text-3xl font-bold mb-4">From Idea to Innovation</h2>
              <p className={`max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Track our evolution from a small startup to a leading career platform.
              </p>
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-300 dark:bg-gray-700"></div>
              
              <div className="space-y-12 md:space-y-0">
                {HISTORY.map((item, index) => (
                  <div key={item.year} className="relative">
                    <div className="md:flex items-center">
                      {/* Year marker - desktop */}
                      <div className="hidden md:flex w-1/2 justify-end pr-8">
                        <div className={`px-4 py-2 rounded-lg font-bold ${
                          isDarkMode 
                            ? 'bg-primary-900 text-primary-300' 
                            : 'bg-primary-100 text-primary-800'
                        }`}>
                          {item.year}
                        </div>
                      </div>
                      
                      {/* Marker circle */}
                      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-primary-500 z-10"></div>
                      
                      {/* Content */}
                      <div className={`md:w-1/2 md:pl-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md`}>
                        {/* Year marker - mobile */}
                        <div className="md:hidden mb-2">
                          <div className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${
                            isDarkMode 
                              ? 'bg-primary-900 text-primary-300' 
                              : 'bg-primary-100 text-primary-800'
                          }`}>
                            {item.year}
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Section */}
        <div className="container mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="inline-block mb-3 py-1 px-3 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 text-sm font-medium">
                Get In Touch
              </div>
              <h2 className="text-3xl font-bold mb-6">We'd Love to Hear From You</h2>
              <p className={`mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Whether you're a job seeker looking for guidance, an employer interested in our services, or just want to say hello, we're here to help.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className={`mt-1 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <Mail size={20} className={isDarkMode ? 'text-primary-400' : 'text-primary-600'} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium mb-1">Email Us</h3>
                    <a 
                      href="mailto:hello@resumerover.com" 
                      className={`text-sm ${isDarkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-800'}`}
                    >
                      hello@resumerover.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`mt-1 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <Phone size={20} className={isDarkMode ? 'text-primary-400' : 'text-primary-600'} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium mb-1">Call Us</h3>
                    <a 
                      href="tel:+1234567890" 
                      className={`text-sm ${isDarkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-800'}`}
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`mt-1 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <MapPin size={20} className={isDarkMode ? 'text-primary-400' : 'text-primary-600'} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium mb-1">Visit Us</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      123 Innovation Road<br />
                      San Francisco, CA 94107
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`rounded-xl overflow-hidden shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8`}>
              <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
              <form>
                <div className="mb-6">
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500' 
                        : 'bg-white border-gray-300 focus:ring-primary-500'
                    } focus:outline-none focus:ring-2`}
                    placeholder="Your name"
                  />
                </div>
                
                <div className="mb-6">
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500' 
                        : 'bg-white border-gray-300 focus:ring-primary-500'
                    } focus:outline-none focus:ring-2`}
                    placeholder="Your email"
                  />
                </div>
                
                <div className="mb-6">
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="5"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500' 
                        : 'bg-white border-gray-300 focus:ring-primary-500'
                    } focus:outline-none focus:ring-2`}
                    placeholder="Your message"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;