import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Dummy templates for now. Replace thumbnails with real images later.
const TEMPLATES = [
  { id: "awesome-cv", name: "Awesome CV", thumb: "https://via.placeholder.com/220x300?text=Awesome+CV" },
  { id: "deedy",      name: "Deedy",     thumb: "https://via.placeholder.com/220x300?text=Deedy" },
  { id: "moderncv",   name: "ModernCV",  thumb: "https://via.placeholder.com/220x300?text=ModernCV" },
];

export default function TemplateSelection() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(() => localStorage.getItem("templateId") || "");

  useEffect(() => {
    if (selected) localStorage.setItem("templateId", selected);
  }, [selected]);

  const proceed = () => {
    if (!selected) return;
    // Next step would be Preview/ATS or PDF generation
    navigate("/preview"); // You can create this route next; for now, navigate nowhere or stay.
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <h2 className="text-3xl font-bold text-gray-800 text-center">Choose a LaTeX Template</h2>
      <p className="text-gray-500 text-center mb-8">You can switch templates later.</p>

      <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map(t => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            className={`group border rounded-xl p-3 transition hover:shadow-lg text-left
              ${selected === t.id ? "ring-2 ring-indigo-500" : "border-gray-200"}`}
            aria-pressed={selected === t.id}
          >
            <img src={t.thumb} alt={`${t.name} preview`} className="w-full rounded-lg mb-3" />
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-800">{t.name}</span>
              <span className={`text-xs px-2 py-1 rounded 
                ${selected === t.id ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}>
                {selected === t.id ? "Selected" : "Select"}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          onClick={() => navigate("/resume-details")}
          className="px-5 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          Back
        </button>
        <button
          onClick={proceed}
          disabled={!selected}
          className="px-6 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
