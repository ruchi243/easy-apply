import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import JobDescription from "./pages/JobDescription";
import ResumeDetails from "./pages/ResumeDetails";
import TemplateSelection from "./pages/TemplateSelection";
import Preview from "./pages/Preview";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/job-description" element={<JobDescription />} />
      <Route path="/resume-details" element={<ResumeDetails />} />
      <Route path="/template-selection" element={<TemplateSelection />} />
      <Route path="/preview" element={<Preview />} />
    </Routes>
  );
}
