import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// --- helpers: very simple keyword extraction & scoring ---
function normalize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractKeywords(text = "") {
  // very basic: split words, drop stop words, keep words length >= 3
  const stop = new Set([
    "and","or","the","a","an","of","to","in","on","for","with","by","as",
    "at","is","are","this","that","it","be","from","your","our","you","we",
    "will","their","they","he","she","them","his","her","have","has","had"
  ]);
  const words = normalize(text).split(" ").filter(w => w.length >= 3 && !stop.has(w));
  // collapse to unique list, keep top frequent-ish
  const freq = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;
  return Object.entries(freq)
    .sort((a,b) => b[1]-a[1])
    .slice(0, 40) // cap
    .map(([w]) => w);
}

function scoreAgainst(jdKeywords, resumeText) {
  const rwords = new Set(extractKeywords(resumeText));
  const present = jdKeywords.filter(k => rwords.has(k));
  const missing = jdKeywords.filter(k => !rwords.has(k));
  const coverage = jdKeywords.length ? present.length / jdKeywords.length : 0;
  // turn into 0-100 with a floor/ceiling
  const score = Math.round((coverage * 100) * 0.9 + 10 * Math.min(1, coverage));
  return { score: Math.max(0, Math.min(score, 100)), present, missing };
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

    const res = await fetch("http://localhost:8000/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId, resumeData }),
    });

    if (!res.ok) {
      alert("PDF generation failed");
      return;
    }

    // download the PDF
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900">Preview & ATS Score</h1>
        <p className="text-gray-600 mb-6">Quick summary before generating your PDF.</p>

        {!ready && (
          <div className="mb-6 p-4 border border-amber-300 bg-amber-50 rounded-lg text-amber-800">
            Missing info detected. Please complete:{" "}
            {!jd && <span className="font-semibold">Job Description </span>}
            {(!resume || !resume.name) && <span className="font-semibold">Resume Details </span>}
            {!templateId && <span className="font-semibold">Template Selection</span>}
          </div>
        )}

        {/* Score Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Info (Condensed)</h2>
            {resume ? (
              <div className="space-y-2 text-gray-700">
                <div><span className="font-medium">Name:</span> {resume.name || "—"}</div>
                <div><span className="font-medium">Email:</span> {resume.email || "—"}</div>
                <div><span className="font-medium">Phone:</span> {resume.phone || "—"}</div>
                <div className="pt-2"><span className="font-medium">Skills:</span> {resume.skills || "—"}</div>
                <div className="pt-2"><span className="font-medium">Experience:</span>
                  <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{resume.experience || "—"}</p>
                </div>
                <div className="pt-2"><span className="font-medium">Education:</span>
                  <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{resume.education || "—"}</p>
                </div>
                {resume.certifications && (
                  <div className="pt-2"><span className="font-medium">Certifications:</span>
                    <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{resume.certifications}</p>
                  </div>
                )}
                {resume.projects && (
                  <div className="pt-2"><span className="font-medium">Projects:</span>
                    <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{resume.projects}</p>
                  </div>
                )}
                <div className="pt-2"><span className="font-medium">Template:</span> {templateId || "—"}</div>
              </div>
            ) : (
              <div className="text-gray-500">No resume data found.</div>
            )}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => navigate("/resume-details")}
                className="px-5 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Edit Details
              </button>
              <button
                onClick={() => navigate("/template-selection")}
                className="px-5 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Change Template
              </button>
            </div>
          </div>

          {/* ATS Panel */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">ATS Score</h2>
            <div className="text-4xl font-extrabold text-indigo-700">{score}</div>
            <div className="mt-3 w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 bg-indigo-600"
                style={{ width: `${Math.max(0, Math.min(score, 100))}%` }}
              />
            </div>
            <p className="text-gray-500 text-sm mt-2">Simple keyword match prototype.</p>

            <div className="mt-5">
              <h3 className="font-medium text-gray-800 mb-1">Matched keywords</h3>
              {present.length ? (
                <div className="flex flex-wrap gap-2">
                  {present.slice(0, 20).map(k => (
                    <span key={k} className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">{k}</span>
                  ))}
                </div>
              ) : <p className="text-gray-500 text-sm">None yet.</p>}
            </div>

            <div className="mt-4">
              <h3 className="font-medium text-gray-800 mb-1">Missing keywords</h3>
              {missing.length ? (
                <div className="flex flex-wrap gap-2">
                  {missing.slice(0, 20).map(k => (
                    <span key={k} className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700">{k}</span>
                  ))}
                </div>
              ) : <p className="text-gray-500 text-sm">Looks good!</p>}
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                className="px-6 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition"
                onClick={generatePdf}
                disabled={!ready}
              >
                Generate PDF
              </button>
              {!ready && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                  Complete JD, resume details, and template selection to enable PDF.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* JD Panel */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Job Description</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-700">
            {jd || "No job description found."}
          </pre>
          <div className="mt-4">
            <button
              onClick={() => navigate("/job-description")}
              className="px-5 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Edit JD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
