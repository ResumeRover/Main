import { useState } from "react";
import { User, Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login/registration logic
    console.log(isLogin ? "Logging in with:" : "Registering with:", { email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-teal-900">
      <div className="relative w-full max-w-md p-8 space-y-8 border shadow-xl bg-gray-900/40 backdrop-blur-md rounded-2xl border-gray-700/30">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="text-2xl font-bold text-white">
            <span>R</span>esume
          </div>
          <div className="text-2xl font-bold text-white">
            <span>R</span>over
          </div>
        </div>

        {/* Login/Register toggle */}
        <div className="flex p-1 mb-6 rounded-lg bg-gray-800/50">
          <button
            className={`flex-1 py-2 rounded-md transition-all ${
              isLogin ? "bg-teal-600 text-white" : "text-gray-400"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-md transition-all ${
              !isLogin ? "bg-teal-600 text-white" : "text-gray-400"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <h2 className="mb-6 text-2xl font-bold text-white">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <div className="space-y-6">
          <div className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full py-3 pl-10 pr-4 text-white placeholder-gray-500 border rounded-lg bg-gray-800/50 border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 pl-10 pr-4 text-white placeholder-gray-500 border rounded-lg bg-gray-800/50 border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>

            <div className="relative">
              <Lock className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 pl-10 pr-4 text-white placeholder-gray-500 border rounded-lg bg-gray-800/50 border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
          </div>

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="w-4 h-4 text-teal-600 bg-gray-800 border-gray-700 rounded focus:ring-teal-500"
                />
                <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-400">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="text-teal-500 hover:text-teal-400">
                  Forgot password?
                </a>
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="relative flex items-center justify-center w-full px-4 py-3 text-white transition-all duration-200 bg-teal-600 rounded-lg group hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <span className="mr-2">{isLogin ? "Sign In" : "Create Account"}</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="mt-6 text-sm text-center text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-teal-500 hover:text-teal-400"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>

        <div className="absolute text-xs text-gray-500 transform -translate-x-1/2 translate-y-full -bottom-2 left-1/2">
          © 2025, Made with ❤️ by Resume Rover
        </div>
      </div>
    </div>
  );
}