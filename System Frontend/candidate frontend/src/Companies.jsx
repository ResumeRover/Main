import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  Home, 
  MapPin, 
  Users,
  Star,
  Filter,
  ChevronDown,
  Briefcase
} from "react-feather";
import { ThemeContext } from "./ThemeContext";
import img from "/logox.png";

// Sample company data - replace with your actual data source
const COMPANIES = [
  {
    id: 1,
    name: "TechGiant",
    logo: "https://logo.clearbit.com/google.com",
    industry: "Technology",
    location: "Mountain View, CA",
    size: "10,000+ employees",
    description: "Leading technology company specializing in internet-related services and products.",
    openPositions: 42,
    rating: 4.7
  },
  {
    id: 2,
    name: "Amazon",
    logo: "https://logo.clearbit.com/amazon.com",
    industry: "E-commerce & Cloud Computing",
    location: "Seattle, WA",
    size: "1,000,000+ employees",
    description: "Multinational technology company focusing on e-commerce, cloud computing, and artificial intelligence.",
    openPositions: 156,
    rating: 4.2
  },
  {
    id: 3,
    name: "Microsoft",
    logo: "https://logo.clearbit.com/microsoft.com",
    industry: "Technology",
    location: "Redmond, WA",
    size: "180,000+ employees",
    description: "Technology corporation that develops, manufactures, licenses, supports, and sells computer software, electronics, and services.",
    openPositions: 98,
    rating: 4.5
  },
  {
    id: 4,
    name: "Acme Corp",
    logo: "https://ui-avatars.com/api/?name=Acme+Corp&background=0096ff&color=fff",
    industry: "Manufacturing",
    location: "Chicago, IL",
    size: "5,000+ employees",
    description: "Leading manufacturer of innovative products for both consumer and industrial markets.",
    openPositions: 18,
    rating: 4.0
  },
  {
    id: 5,
    name: "HealthPlus",
    logo: "https://ui-avatars.com/api/?name=Health+Plus&background=00a76f&color=fff",
    industry: "Healthcare",
    location: "Boston, MA",
    size: "8,000+ employees",
    description: "Healthcare provider focused on patient-centric innovation and digital health solutions.",
    openPositions: 32,
    rating: 4.3
  },
  {
    id: 6,
    name: "FinTech Solutions",
    logo: "https://ui-avatars.com/api/?name=Fin+Tech&background=7b68ee&color=fff",
    industry: "Financial Technology",
    location: "New York, NY",
    size: "2,500+ employees",
    description: "Innovative financial technology company revolutionizing banking and payment solutions.",
    openPositions: 27,
    rating: 4.1
  },
  {
    id: 7,
    name: "EcoEnergy",
    logo: "https://ui-avatars.com/api/?name=Eco+Energy&background=2e8b57&color=fff",
    industry: "Renewable Energy",
    location: "Austin, TX",
    size: "1,200+ employees",
    description: "Leading renewable energy company focused on sustainable solutions and green technology.",
    openPositions: 15,
    rating: 4.4
  },
  {
    id: 8,
    name: "Creative Media",
    logo: "https://ui-avatars.com/api/?name=Creative+Media&background=ff6347&color=fff",
    industry: "Media & Entertainment",
    location: "Los Angeles, CA",
    size: "3,800+ employees",
    description: "Global media company specializing in film, television, and digital content production.",
    openPositions: 24,
    rating: 4.2
  }
];

const Companies = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Extract unique industries for the filter dropdown
  const industries = [...new Set(COMPANIES.map(company => company.industry))];

  // Handle search and filter
  useEffect(() => {
    // Set initial company data
    setFeaturedCompanies(COMPANIES.slice(0, 4));
    setAllCompanies(COMPANIES);
    
    // Apply search and filters
    let filtered = COMPANIES;
    
    if (searchTerm) {
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedIndustries.length > 0) {
      filtered = filtered.filter(company => 
        selectedIndustries.includes(company.industry)
      );
    }
    
    setAllCompanies(filtered);
  }, [searchTerm, selectedIndustries]);

  // Toggle industry selection
  const toggleIndustry = (industry) => {
    if (selectedIndustries.includes(industry)) {
      setSelectedIndustries(selectedIndustries.filter(i => i !== industry));
    } else {
      setSelectedIndustries([...selectedIndustries, industry]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedIndustries([]);
  };

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

            {/* Companies Link - Active */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/10 via-primary-500/20 to-violet-500/10 rounded-lg blur-md"></div>
              <Link
                to="/companies"
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
                    Companies
                  </span>
                </span>
              </Link>
            </div>

            {/* About Link */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-violet-500/0 rounded-lg blur-md group-hover:via-primary-500/20 transition-all duration-300"></div>
              <Link
                to="/about"
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
                    About
                  </span>
                </span>
              </Link>
            </div>
          </div>

          {/* Search and Theme Toggle */}
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
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 pt-32 pb-16">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className={isDarkMode ? "text-white" : "text-gray-900"}>Discover Top </span>
            <span className={`${isDarkMode ? "text-primary-400" : "text-primary-600"} relative`}>
              Companies
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
          <p className="text-xl max-w-3xl mx-auto mt-6 mb-8 text-gray-600 dark:text-gray-300">
            Explore opportunities at leading companies across industries and find your perfect workplace match.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className={`rounded-xl p-6 mb-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} size={18} />
              </div>
              <input
                type="text"
                placeholder="Search by company name, industry, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-500' 
                    : 'bg-white border-gray-300 focus:border-primary-500'
                } focus:outline-none focus:ring-2 focus:ring-primary-500/50`}
              />
            </div>
            
            <div className="hidden md:block relative">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`flex items-center px-4 py-3 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                } transition-colors`}
              >
                <Filter size={18} className="mr-2" />
                Filter by Industry
                <ChevronDown size={18} className="ml-2" />
              </button>
              
              {filtersOpen && (
                <div className={`absolute mt-2 w-80 p-4 rounded-lg shadow-lg z-20 ${
                  isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
                }`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Industries</h3>
                    <button 
                      onClick={clearFilters}
                      className="text-xs text-primary-500 hover:text-primary-600"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {industries.map(industry => (
                      <div key={industry} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`industry-${industry}`}
                          checked={selectedIndustries.includes(industry)}
                          onChange={() => toggleIndustry(industry)}
                          className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
                        />
                        <label 
                          htmlFor={`industry-${industry}`}
                          className={`ml-2 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                        >
                          {industry}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`md:hidden flex items-center justify-center px-4 py-3 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              } transition-colors`}
            >
              <Filter size={18} className="mr-2" />
              Filters
            </button>
          </div>
          
          {/* Mobile filters dropdown */}
          {filtersOpen && (
            <div className={`mt-4 p-4 rounded-lg border md:hidden ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Industries</h3>
                <button 
                  onClick={clearFilters}
                  className="text-xs text-primary-500 hover:text-primary-600"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {industries.map(industry => (
                  <div key={industry} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`mobile-industry-${industry}`}
                      checked={selectedIndustries.includes(industry)}
                      onChange={() => toggleIndustry(industry)}
                      className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
                    />
                    <label 
                      htmlFor={`mobile-industry-${industry}`}
                      className={`ml-2 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                    >
                      {industry}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Active filters display */}
          {selectedIndustries.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedIndustries.map(industry => (
                <span 
                  key={industry}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-200' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {industry}
                  <button 
                    onClick={() => toggleIndustry(industry)}
                    className="ml-2 focus:outline-none"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              <button 
                onClick={clearFilters}
                className={`text-sm underline ${
                  isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Featured Companies Section */}
        {featuredCompanies.length > 0 && searchTerm === '' && selectedIndustries.length === 0 && (
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Featured Companies</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCompanies.map(company => (
                <div 
                  key={company.id}
                  onClick={() => navigate(`/companies/${company.id}`)}
                  className={`group cursor-pointer rounded-xl p-6 ${
                    isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-white hover:bg-gray-50'
                  } shadow-md transition-all duration-300 hover:shadow-lg border-2 border-transparent hover:border-primary-500/20`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-16 w-16 overflow-hidden rounded-lg flex items-center justify-center bg-white">
                      <img 
                        src={company.logo}
                        alt={company.name}
                        className="h-12 w-12 object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${company.name.split(' ').join('+')}&background=0096ff&color=fff`;
                        }}
                      />
                    </div>
                    <div className={`flex items-center ${
                      isDarkMode ? 'text-yellow-400' : 'text-yellow-500'
                    }`}>
                      <Star size={16} fill="currentColor" />
                      <span className="ml-1 font-medium">{company.rating}</span>
                    </div>
                  </div>
                  <h3 className={`text-xl font-bold mb-1 group-hover:text-primary-500 transition-colors`}>
                    {company.name}
                  </h3>
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {company.industry}
                  </p>
                  <div className="flex items-center mb-3">
                    <MapPin size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                    <span className={`ml-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {company.location}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <Briefcase size={16} className="text-primary-500" />
                      <span className={`ml-1 text-sm font-medium ${
                        isDarkMode ? 'text-primary-400' : 'text-primary-600'
                      }`}>
                        {company.openPositions} open positions
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Companies */}
        <div>
          <h2 className="text-2xl font-bold mb-8">
            {searchTerm || selectedIndustries.length > 0 
              ? 'Search Results' 
              : 'All Companies'}
            {allCompanies.length > 0 && 
              <span className={`text-lg ml-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                ({allCompanies.length})
              </span>
            }
          </h2>
          
          {allCompanies.length === 0 ? (
            <div className={`text-center py-16 rounded-xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-md`}>
              <Home size={48} className={`mx-auto mb-4 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className="text-xl font-semibold mb-2">No companies found</h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-md mx-auto`}>
                We couldn't find any companies matching your search criteria. Try adjusting your filters or search term.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCompanies.map(company => (
                <div 
                  key={company.id}
                  onClick={() => navigate(`/companies/${company.id}`)}
                  className={`group cursor-pointer rounded-xl border ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 hover:border-primary-600' 
                      : 'bg-white border-gray-200 hover:border-primary-400'
                  } transition-all duration-300 hover:shadow-lg overflow-hidden`}
                >
                  <div className={`h-24 flex items-center justify-center ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  } relative`}>
                    <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                      <Star size={12} className={`${
                        isDarkMode ? 'text-yellow-400' : 'text-yellow-500'
                      } mr-1`} fill="currentColor" />
                      {company.rating}
                    </div>
                    <div className="h-16 w-16 overflow-hidden rounded-lg flex items-center justify-center bg-white">
                      <img 
                        src={company.logo}
                        alt={company.name}
                        className="h-12 w-12 object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${company.name.split(' ').join('+')}&background=0096ff&color=fff`;
                        }}
                      />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className={`text-xl font-bold mb-1 group-hover:text-primary-500 transition-colors`}>
                      {company.name}
                    </h3>
                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {company.industry}
                    </p>
                    <div className="flex items-center mb-2">
                      <MapPin size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                      <span className={`ml-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {company.location}
                      </span>
                    </div>
                    <div className="flex items-center mb-4">
                      <Users size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                      <span className={`ml-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {company.size}
                      </span>
                    </div>
                    <p className={`text-sm mb-4 line-clamp-2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {company.description}
                    </p>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Briefcase size={16} className="text-primary-500" />
                          <span className={`ml-1 text-sm font-medium ${
                            isDarkMode ? 'text-primary-400' : 'text-primary-600'
                          }`}>
                            {company.openPositions} open positions
                          </span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          isDarkMode 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          View Jobs
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Companies;