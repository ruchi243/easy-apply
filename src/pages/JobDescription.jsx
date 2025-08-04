import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function JobDescription() {
  const navigate = useNavigate();
  const [jd, setJd] = useState(() => localStorage.getItem("jobDescription") || "");

  useEffect(() => {
    // auto-save while typing
    localStorage.setItem("jobDescription", jd);
  }, [jd]);

  const handleNext = () => navigate("/resume-details");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Paste the Job Description</h1>
      <p className="text-gray-500 mb-6">We’ll tailor your resume to this.</p>

      <textarea
        className="w-full max-w-2xl h-64 p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        placeholder="Paste the JD here…"
        value={jd}
        onChange={(e) => setJd(e.target.value)}
      />

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => { setJd(""); localStorage.removeItem("jobDescription"); }}
          className="px-5 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          Clear
        </button>
        <button
          onClick={handleNext}
          disabled={!jd.trim()}
          className="px-6 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-40"
        >
          Next: Resume Details
        </button>
      </div>
    </div>
  );
}
