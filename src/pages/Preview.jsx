import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";

// --- helpers: improved keyword extraction & scoring ---
function normalize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractKeywords(text = "") {
  // Enhanced stop words list - focus on technical terms
  const stop = new Set([
    "and","or","the","a","an","of","to","in","on","for","with","by","as",
    "at","is","are","this","that","it","be","from","your","our","you","we",
    "will","their","they","he","she","them","his","her","have","has","had",
    "can","could","should","would","may","might","must","shall","do","does",
    "did","get","got","make","made","take","took","come","came","go","went",
    "see","saw","know","knew","think","thought","say","said","work","worked",
    "use","used","find","found","give","gave","tell","told","become","became",
    "strong","excellent","good","great","best","better","well","very","really",
    "highly","deeply","thoroughly","completely","fully","entirely","totally",
    "years","year","experience","experiences","skills","skill","ability",
    "abilities","capability","capabilities","knowledge","understanding"
  ]);
  
  const words = normalize(text).split(" ").filter(w => w.length >= 3 && !stop.has(w));
  const freq = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;
  
  return Object.entries(freq)
    .sort((a,b) => b[1]-a[1])
    .slice(0, 30) // Focus on top 30 most relevant terms
    .map(([w]) => w);
}

function scoreAgainst(jdKeywords, resumeText) {
  if (!jdKeywords.length || !resumeText) {
    return { score: 0, present: [], missing: jdKeywords };
  }
  
  const rwords = new Set(extractKeywords(resumeText));
  const present = jdKeywords.filter(k => rwords.has(k));
  const missing = jdKeywords.filter(k => !rwords.has(k));
  const coverage = present.length / jdKeywords.length;
  
  // More realistic scoring: base score + bonus for good coverage
  let score = Math.round(coverage * 85); // Base score up to 85%
  if (coverage > 0.7) score += 10; // Bonus for high coverage
  if (coverage > 0.5) score += 5;  // Bonus for decent coverage
  
  return { 
    score: Math.max(15, Math.min(score, 95)), // Floor of 15, ceiling of 95
    present, 
    missing 
  };
}

export default function Preview() {
  const navigate = useNavigate();
  const [jd, setJd] = useState("");
  const [resume, setResume] = useState(null);
  const [templateId, setTemplateId] = useState("");

  useEffect(() => {
    setJd(localStorage.getItem("jobDescription") || "");
    try {
      setResume(JSON.parse(localStorage.getItem("resumeData")) || {});
    } catch {
      setResume({});
    }
    setTemplateId(localStorage.getItem("templateId") || "");
  }, []);

  const resumeText = useMemo(() => {
    if (!resume) return "";
    return [
      resume.name, resume.email, resume.phone,
      resume.experience, resume.education,
      resume.skills, resume.certifications, resume.projects
    ].filter(Boolean).join(" ");
  }, [resume]);

  const jdKeywords = useMemo(() => extractKeywords(jd), [jd]);
  const { score, present, missing } = useMemo(
    () => scoreAgainst(jdKeywords, resumeText),
    [jdKeywords, resumeText]
  );

  const ready = jd && resume && Object.keys(resume).length > 0 && templateId;

  // ✅ PDF generator function
  async function generatePdf() {
    const resumeData = JSON.parse(localStorage.getItem("resumeData") || "{}");
    const templateId = localStorage.getItem("templateId") || "simple";
    const jobDescription = localStorage.getItem("jobDescription") || "";

    console.log("Generating PDF with:", { templateId, resumeData, jobDescription });

    try {
      const res = await fetch("http://localhost:8000/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, resumeData, jobDescription }),
      });

      console.log("Response status:", res.status);
      console.log("Response headers:", res.headers);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("PDF generation failed:", errorText);
        alert(`PDF generation failed: ${errorText}`);
        return;
      }

      // Check if response is actually a PDF
      const contentType = res.headers.get("content-type");
      console.log("Content-Type:", contentType);
      
      if (!contentType || !contentType.includes("application/pdf")) {
        const text = await res.text();
        console.error("Response is not a PDF:", text);
        alert(`Server returned non-PDF content: ${text.substring(0, 200)}...`);
        return;
      }

      // download the PDF
      const blob = await res.blob();
      console.log("Blob size:", blob.size);
      
      if (blob.size === 0) {
        alert("Generated PDF is empty. Please check the server logs.");
        return;
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume-${templateId}-${new Date().toISOString().split('T')[0]}.pdf`;
      a.style.display = 'none';
      document.body.appendChild(a);
      
      // Force click with a small delay
      setTimeout(() => {
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        console.log("PDF download initiated");
        
        // Show success message
        alert("PDF downloaded successfully! Check your Downloads folder.");
      }, 100);
    } catch (error) {
      console.error("Network error:", error);
      alert(`Network error: ${error.message}`);
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Step 4: Preview & ATS Analysis
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Review your information and ATS compatibility score before generating your tailored resume.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {!ready && (
          <div className="mb-8 p-6 border border-yellow-300 bg-yellow-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
              <div>
                <h3 className="text-yellow-800 font-semibold">Missing Information</h3>
                <p className="text-yellow-700 text-sm">
                  Please complete: {!jd && "Job Description"} {(!resume || !resume.name) && "Resume Details"} {!templateId && "Template Selection"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Resume Summary */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                Resume Summary
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                Template: {templateId || "None"}
              </span>
            </div>

            {resume ? (
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <span className="text-gray-500 text-sm">Name</span>
                    <p className="text-gray-900 font-semibold">{resume.name || "—"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Email</span>
                    <p className="text-gray-900">{resume.email || "—"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Phone</span>
                    <p className="text-gray-900">{resume.phone || "—"}</p>
                  </div>
                </div>

                {/* Sections */}
                {[
                  { key: 'skills', label: 'Skills', color: 'bg-green-500' },
                  { key: 'experience', label: 'Experience', color: 'bg-blue-500' },
                  { key: 'education', label: 'Education', color: 'bg-purple-500' },
                  { key: 'projects', label: 'Projects', color: 'bg-orange-500' },
                  { key: 'certifications', label: 'Certifications', color: 'bg-pink-500' }
                ].map(section => resume[section.key] && (
                  <div key={section.key} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-gray-900 font-semibold mb-3 flex items-center">
                      <div className={`w-2 h-2 ${section.color} rounded-full mr-3`}></div>
                      {section.label}
                    </h3>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap line-clamp-4">
                      {resume[section.key]}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">No resume data found.</div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/resume-details")}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Edit Details
              </button>
              <button
                onClick={() => navigate("/template-selection")}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Change Template
              </button>
              <button
                onClick={() => navigate("/job-description")}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Edit Job Description
              </button>
            </div>
          </div>

          {/* ATS Score Panel */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              ATS Score
            </h2>

            {/* Score Display */}
            <div className="text-center mb-6">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>
                {score}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
                <div
                  className={`h-3 transition-all duration-500 ${getScoreBg(score)}`}
                  style={{ width: `${Math.max(0, Math.min(score, 100))}%` }}
                />
              </div>
              <p className="text-gray-600 text-sm">
                {score >= 80 ? "Excellent match!" : 
                 score >= 60 ? "Good compatibility" : 
                 score >= 40 ? "Needs improvement" : "Poor match"}
              </p>
            </div>

            {/* Keyword Analysis */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-green-600 mb-2 flex items-center justify-between">
                  <span>Matched Keywords</span>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">{present.length}</span>
                </h3>
                {present.length ? (
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {present.slice(0, 15).map(k => (
                      <span key={k} className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                        {k}
                      </span>
                    ))}
                    {present.length > 15 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        +{present.length - 15} more
                      </span>
                    )}
                  </div>
                ) : <p className="text-gray-500 text-sm">No matches found</p>}
              </div>

              <div>
                <h3 className="font-semibold text-yellow-600 mb-2 flex items-center justify-between">
                  <span>Missing Keywords</span>
                  <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">{missing.length}</span>
                </h3>
                {missing.length ? (
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {missing.slice(0, 15).map(k => (
                      <span key={k} className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
                        {k}
                      </span>
                    ))}
                    {missing.length > 15 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        +{missing.length - 15} more
                      </span>
                    )}
                  </div>
                ) : <p className="text-gray-500 text-sm">All keywords matched!</p>}
              </div>
            </div>

            {/* Generate Button */}
            <div className="mt-8">
              <button
                className="w-full py-4 px-6 rounded-xl text-white font-semibold bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={generatePdf}
                disabled={!ready}
              >
                {ready ? "Generate Resume PDF" : "Complete All Steps First"}
              </button>
              
              {!ready && (
                <p className="text-xs text-yellow-600 mt-2 text-center">
                  Complete job description, resume details, and template selection
                </p>
              )}
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Improve Your Score</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Include more technical skills from the job description</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Use specific tools and technologies mentioned</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Match the job's required experience level</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Highlight relevant certifications and skills</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Job Description Panel */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
            Target Job Description
          </h2>
          <div className="bg-gray-50 rounded-lg p-6 max-h-64 overflow-y-auto border border-gray-200">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
              {jd || "No job description provided. Add one to improve ATS matching."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}