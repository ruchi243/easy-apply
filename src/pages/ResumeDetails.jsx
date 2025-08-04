import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EMPTY = {
  name: "", email: "", phone: "",
  experience: "", education: "", skills: "", certifications: "", projects: ""
};

export default function ResumeDetails() {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => {
    try { return JSON.parse(localStorage.getItem("resumeData")) || EMPTY; }
    catch { return EMPTY; }
  });

  useEffect(() => {
    localStorage.setItem("resumeData", JSON.stringify(form));
  }, [form]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleNext = () => navigate("/template-selection");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Resume Details</h2>
      <p className="text-gray-500 mb-6">You can keep it short. We’ll tailor later.</p>

      <div className="w-full max-w-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {["name","email","phone"].map((field) => (
            <input
              key={field}
              name={field}
              value={form[field]}
              onChange={onChange}
              placeholder={field[0].toUpperCase() + field.slice(1)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          ))}
        </div>

        <textarea
          name="experience"
          value={form.experience}
          onChange={onChange}
          placeholder="Work Experience (bullets recommended)"
          className="w-full p-3 border border-gray-300 rounded-lg h-28"
        />
        <textarea
          name="education"
          value={form.education}
          onChange={onChange}
          placeholder="Education"
          className="w-full p-3 border border-gray-300 rounded-lg h-20"
        />
        <textarea
          name="skills"
          value={form.skills}
          onChange={onChange}
          placeholder="Skills (comma-separated)"
          className="w-full p-3 border border-gray-300 rounded-lg h-16"
        />
        <textarea
          name="certifications"
          value={form.certifications}
          onChange={onChange}
          placeholder="Certifications (optional)"
          className="w-full p-3 border border-gray-300 rounded-lg h-16"
        />
        <textarea
          name="projects"
          value={form.projects}
          onChange={onChange}
          placeholder="Projects (optional)"
          className="w-full p-3 border border-gray-300 rounded-lg h-20"
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => { localStorage.removeItem("resumeData"); setForm(EMPTY); }}
          className="px-5 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          Reset
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition"
        >
          Choose Template
        </button>
      </div>
    </div>
  );
}
