import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";

export default function Home() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleContinueWithoutLogin = () => {
    navigate("/job-description");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/job-description");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section - Jobscan.co style */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Smart Resume Builder
            </h1>
            <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Create ATS-optimized resumes that get you noticed by recruiters
            </p>
            
            {/* CTA Buttons - Jobscan style */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={() => setShowLogin(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
              >
                Get Started Free
              </button>
              <button
                onClick={handleContinueWithoutLogin}
                className="bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-4 px-8 rounded-lg text-lg transition-colors"
              >
                Try Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>100% Free</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>No Registration Required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>ATS Optimized</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal - Jobscan style */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
              <button
                onClick={() => setShowLogin(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Features Section - Jobscan style */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Resume Builder?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get past ATS systems and land more interviews with our AI-powered resume optimization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-green-600 rounded-lg"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">ATS Optimization</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI analyzes job descriptions and optimizes your resume to pass through applicant tracking systems
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-green-600 rounded-lg"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Real-time Scoring</h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant feedback on your resume's ATS compatibility with detailed keyword analysis
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-green-600 rounded-lg"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Templates</h3>
              <p className="text-gray-600 leading-relaxed">
                Choose from multiple ATS-friendly templates designed for different industries and career levels
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of job seekers who've improved their interview rates
          </p>
          <button
            onClick={handleContinueWithoutLogin}
            className="bg-white text-green-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
          >
            Start Building Your Resume
          </button>
        </div>
      </div>
    </div>
  );
}