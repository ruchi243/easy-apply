import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";

const TEMPLATES = [
  { 
    id: "classic", 
    name: "Classic Professional", 
    description: "Traditional ATS-friendly format with clean sections",
    features: ["ATS Optimized", "Professional Layout", "Skills Section", "Experience Focus"],
    bestFor: "Corporate roles, traditional industries"
  },
  { 
    id: "modern", 
    name: "Modern Academic", 
    description: "Contemporary design with project highlights",
    features: ["Project Showcase", "Skills Categories", "Awards Section", "Clean Typography"],
    bestFor: "Tech roles, startups, creative positions"
  },
  { 
    id: "research", 
    name: "Research Scholar", 
    description: "Academic-focused with publications and services",
    features: ["Academic Services", "Research Projects", "Institution Focus", "Scholarly Format"],
    bestFor: "Academic positions, research roles, PhD applications"
  },
  { 
    id: "simple", 
    name: "Simple & Clean", 
    description: "Minimalist design focusing on content",
    features: ["Minimal Design", "Content Focus", "Easy to Read", "Quick Setup"],
    bestFor: "Entry-level positions, career changes"
  }
];

export default function TemplateSelection() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(() => localStorage.getItem("templateId") || "");

  useEffect(() => {
    if (selected) localStorage.setItem("templateId", selected);
  }, [selected]);

  const proceed = () => {
    if (!selected) return;
    navigate("/preview");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Step 3: Choose Template
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select a professional template that matches your industry and career level. You can always switch later.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {TEMPLATES.map(template => (
            <div
              key={template.id}
              onClick={() => setSelected(template.id)}
              className={`group cursor-pointer bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                selected === template.id 
                  ? "border-green-500 shadow-lg ring-2 ring-green-500 ring-opacity-20" 
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              {/* Template Preview Area */}
              <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b border-gray-200">
                <div className="text-center">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                    selected === template.id ? "bg-green-500" : "bg-gray-300"
                  }`}>
                    <div className={`w-10 h-10 rounded ${selected === template.id ? "bg-white" : "bg-gray-100"} opacity-80`}></div>
                  </div>
                  <div className={`text-sm font-medium ${
                    selected === template.id ? "text-green-600" : "text-gray-500"
                  }`}>
                    {selected === template.id ? "Selected Template" : "Preview Available"}
                  </div>
                </div>
                
                {/* Selection Indicator */}
                {selected === template.id && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{template.name}</h3>
                  <span className={`text-sm px-4 py-2 rounded-full font-medium ${
                    selected === template.id 
                      ? "bg-green-100 text-green-600" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {selected === template.id ? "Selected" : "Select"}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">{template.description}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {template.features.map((feature, index) => (
                      <span key={index} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Best for:</h4>
                  <p className="text-sm text-gray-600">{template.bestFor}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate("/resume-details")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Resume Details</span>
          </button>
          
          <button
            onClick={proceed}
            disabled={!selected}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            Preview & Generate
          </button>
        </div>

        {/* Template Comparison */}
        {selected && (
          <div className="mt-12 bg-green-50 rounded-xl border border-green-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              You selected: {TEMPLATES.find(t => t.id === selected)?.name}
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              This template is perfect for {TEMPLATES.find(t => t.id === selected)?.bestFor.toLowerCase()}. 
              Your resume will be optimized with the selected template's strengths while maintaining ATS compatibility.
            </p>
            <div className="flex items-center space-x-8 text-sm text-gray-600">
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>ATS Compatible</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Professional Design</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>AI Optimized</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}