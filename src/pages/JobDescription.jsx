import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";

export default function JobDescription() {
  const navigate = useNavigate();
  const [jd, setJd] = useState(() => localStorage.getItem("jobDescription") || "");

  useEffect(() => {
    localStorage.setItem("jobDescription", jd);
  }, [jd]);

  const handleNext = () => navigate("/resume-details");

  const charCount = jd.length;
  const maxChars = 5000;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section - Jobscan style */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Step 1: Job Description
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Paste the job description you're applying for. Our AI will analyze it and optimize your resume accordingly.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header with character count */}
          <div className="bg-gray-50 border-b border-gray-200 px-8 py-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Job Description</h2>
              <div className="text-sm text-gray-500">
                <span className={charCount > maxChars ? "text-red-500" : "text-gray-700"}>
                  {charCount.toLocaleString()}
                </span>
                <span> / {maxChars.toLocaleString()} characters</span>
              </div>
            </div>
          </div>

          {/* Textarea */}
          <div className="p-8">
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              className="w-full h-96 p-6 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Paste the complete job description here...

Example:
Software Engineer - Full Stack
Company: TechCorp Inc.
Location: San Francisco, CA

We are looking for a talented Full Stack Developer to join our growing team...

Requirements:
• 3+ years of experience with React, Node.js
• Experience with databases (PostgreSQL, MongoDB)
• Knowledge of cloud platforms (AWS, Azure)
• Strong problem-solving skills..."
              maxLength={maxChars}
            />
          </div>
        </div>

        {/* Tips Section - Jobscan style */}
        <div className="mt-8 bg-green-50 rounded-xl border border-green-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            Tips for Better Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700 text-sm">Include the complete job posting with all requirements</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700 text-sm">Copy technical skills, tools, and technologies mentioned</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700 text-sm">Include company culture and values if mentioned</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700 text-sm">The more details, the better our AI can optimize your resume</span>
            </div>
          </div>
        </div>

        {/* Navigation Buttons - Jobscan style */}
        <div className="flex justify-between items-center mt-12">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Home</span>
          </button>
          
          <div className="flex gap-4">
            <button
              onClick={() => { setJd(""); localStorage.removeItem("jobDescription"); }}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleNext}
              disabled={!jd.trim()}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              Next: Resume Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}