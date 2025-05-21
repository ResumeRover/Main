import { useState, useEffect } from "react";
import { Lock, Mail, ArrowRight, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "./logowhite.png";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showSampleCredentials, setShowSampleCredentials] = useState(false);
  
  const navigate = useNavigate();
  
  // Sample credentials
  // const sampleUsername = "testuser";
  // const samplePassword = "testpassword";
  
  // Check for remembered username on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError("");
      
      // Skip actual API call for testing and use sample credentials
      // if (username === sampleUsername && password === samplePassword) {
      //   // Mock successful authentication
      //   localStorage.setItem("access_token", "sample-token-for-testing");
      //   localStorage.setItem("token_type", "bearer");
      //   localStorage.setItem("isAuthenticated", "true");
        
      //   if (rememberMe) {
      //     localStorage.setItem("username", username);
      //   } else {
      //     localStorage.removeItem("username");
      //   }
        
      //   // Log success for testing
      //   console.log("Login successful with sample credentials");
        
      //   // Redirect to admin panel
      //   navigate("/Resume_Rover_Main/admin");
      //   return;
      // }
      
      // If not using sample credentials, proceed with actual API call
      const response = await fetch("https://resumeparserauthcs3023.azurewebsites.net/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Login failed. Please check your credentials.");
      }
      
      // Store the token and authentication status
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("token_type", data.token_type);
      localStorage.setItem("isAuthenticated", "true");
      
      if (rememberMe) {
        localStorage.setItem("username", username);
      } else {
        localStorage.removeItem("username");
      }
      
      // Redirect to admin panel
      navigate("/Resume_Rover_Main/admin");
      
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to auto-fill sample credentials
  const fillSampleCredentials = () => {
    setUsername(sampleUsername);
    setPassword(samplePassword);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-[#0A101F]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A101F] via-[#0E1C2F] to-[#0A101F] opacity-80"></div>
      
      {/* Professional subtle patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', 
          backgroundSize: '24px 24px' 
        }}></div>
      </div>
      
      {/* Background accent elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] left-[10%] w-96 h-96 bg-teal-600/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[5%] right-[10%] w-96 h-96 bg-blue-600/5 rounded-full blur-[100px]"></div>
      </div>
      
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 border-0 shadow-2xl bg-gray-900/80 backdrop-blur-md rounded-2xl">
        {/* Subtle edge highlight */}
        <div className="absolute inset-0 rounded-2xl border border-gray-700/40"></div>
        <div className="absolute -inset-[0.5px] rounded-2xl border border-teal-500/10"></div>
        
        {/* Card content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Resume Rover Logo" className="h-12" />
          </div>

          <h2 className="mb-8 text-2xl font-medium text-center text-white">
            Sign in to your account
          </h2>

          {/* Sample Credentials Notice */}
          {/* <div className="mb-6 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
            <div 
              className="flex items-center justify-between cursor-pointer" 
              onClick={() => setShowSampleCredentials(!showSampleCredentials)}
            >
              <div className="flex items-center">
                <Info size={18} className="text-blue-400 mr-2" />
                <span className="text-sm font-medium text-blue-200">Use sample credentials for testing</span>
              </div>
              <div className="text-blue-400">
                {showSampleCredentials ? '−' : '+'}
              </div>
            </div>
            
            {showSampleCredentials && (
              <div className="mt-3 pt-3 border-t border-blue-800/30">
                <p className="text-sm text-blue-300 mb-2">Username: <span className="font-mono bg-blue-900/30 px-1 rounded">testuser</span></p>
                <p className="text-sm text-blue-300 mb-3">Password: <span className="font-mono bg-blue-900/30 px-1 rounded">testpassword</span></p>
                <button
                  type="button"
                  onClick={fillSampleCredentials}
                  className="text-xs bg-blue-700/50 hover:bg-blue-700/70 text-white py-1 px-2 rounded transition-colors"
                >
                  Auto-fill credentials
                </button>
              </div>
            )}
          </div> */}

          {error && (
            <div className="p-3 mb-6 text-sm font-medium text-red-200 bg-red-900/20 border border-red-800/30 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2 transition-all duration-200 group-focus-within:text-green-500" size={18} />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full py-3 pl-10 pr-4 text-white bg-gray-800/90 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-gray-500"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2 transition-all duration-200 group-focus-within:text-green-500" size={18} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full py-3 pl-10 pr-4 text-white bg-gray-800/90 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-gray-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-gray-600 rounded bg-gray-700 text-green-500 focus:ring-green-500/30 focus:ring-offset-0"
                />
                <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-400">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="text-green-500 hover:text-green-400 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full py-3 mt-2 text-sm font-medium text-white transition-all duration-200 bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-green-600"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span>Sign In</span>
                  <ArrowRight size={16} className="ml-2" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-sm text-center text-gray-500">
              Secure login for Resume Rover HR Panel
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-600">
        © 2025 Resume Rover. All rights reserved.
      </div>
    </div>
  );
}