import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";

const EMPTY = {
  name: "", email: "", phone: "",
  experience: "", education: "", skills: "", certifications: "", projects: ""
};

// Load test profile data
const TEST_PROFILE = {
  name: "Alexandra Chen",
  email: "alexandra.chen@email.com",
  phone: "+1 (555) 123-4567",
  
  experience: "Senior Software Engineer | Microsoft | Seattle, WA | 2021 - Present\n• Led development of cloud-native microservices using Node.js and TypeScript, serving 10M+ users daily\n• Architected and implemented GraphQL APIs that reduced data transfer by 40% and improved mobile app performance\n• Mentored 5 junior developers and established code review processes that decreased bug reports by 35%\n• Collaborated with product teams to deliver 15+ features using agile methodologies and CI/CD pipelines\n• Optimized database queries and implemented Redis caching, reducing API response times by 60%\n\nFull Stack Developer | Startup Inc. | San Francisco, CA | 2019 - 2021\n• Built responsive web applications using React, Redux, and Material-UI for 500K+ active users\n• Developed RESTful APIs with Express.js and integrated with PostgreSQL and MongoDB databases\n• Implemented automated testing with Jest and Cypress, achieving 90% code coverage\n• Deployed applications on AWS using Docker containers and managed infrastructure with Terraform\n• Worked directly with founders to define technical requirements and product roadmap\n\nSoftware Developer | TechStart Solutions | Austin, TX | 2017 - 2019\n• Developed e-commerce platforms using React and Node.js, processing $2M+ in monthly transactions\n• Integrated third-party payment systems (Stripe, PayPal) and implemented fraud detection algorithms\n• Created data visualization dashboards using D3.js and Chart.js for business analytics\n• Participated in agile development cycles and maintained 99.9% application uptime",
  
  education: "Master of Science in Computer Science | Stanford University | Stanford, CA | 2017\n• Specialization in Artificial Intelligence and Machine Learning\n• Thesis: \"Deep Learning Approaches for Natural Language Processing in Healthcare\"\n• GPA: 3.8/4.0\n• Relevant Coursework: Algorithms, Database Systems, Distributed Systems, Machine Learning\n\nBachelor of Science in Software Engineering | University of California, Berkeley | Berkeley, CA | 2015\n• Magna Cum Laude, GPA: 3.7/4.0\n• President of Computer Science Student Association\n• Dean's List for 6 semesters\n• Relevant Coursework: Data Structures, Software Architecture, Web Development, Mobile Computing",
  
  skills: "Programming Languages: JavaScript, TypeScript, Python, Java, C++, SQL\nFrontend Technologies: React, Vue.js, Angular, HTML5, CSS3, Sass, Material-UI, Bootstrap\nBackend Technologies: Node.js, Express.js, Django, Spring Boot, GraphQL, REST APIs\nDatabases: PostgreSQL, MongoDB, MySQL, Redis, DynamoDB\nCloud Platforms: AWS (EC2, S3, Lambda, RDS), Azure, Google Cloud Platform\nDevOps & Tools: Docker, Kubernetes, Jenkins, GitLab CI, Terraform, Ansible\nTesting: Jest, Cypress, Mocha, Selenium, Unit Testing, Integration Testing\nVersion Control: Git, GitHub, GitLab, Bitbucket\nMethodologies: Agile, Scrum, Test-Driven Development, Microservices Architecture",
  
  projects: "E-Commerce Analytics Platform | Personal Project | 2023\n• Built a full-stack analytics platform using React, Node.js, and PostgreSQL\n• Implemented real-time data processing with Apache Kafka and Redis\n• Created interactive dashboards with D3.js showing sales trends and customer behavior\n• Deployed on AWS using Docker containers and managed with Kubernetes\n• Technologies: React, Node.js, PostgreSQL, Kafka, Redis, D3.js, AWS, Docker\n\nOpen Source Contribution - React Performance Library | GitHub | 2022\n• Contributed to popular React performance optimization library with 15K+ stars\n• Implemented lazy loading components that improved bundle size by 25%\n• Added TypeScript support and comprehensive documentation\n• Collaborated with maintainers through code reviews and issue discussions\n• Technologies: React, TypeScript, Webpack, Rollup\n\nMobile Expense Tracker | React Native | 2021\n• Developed cross-platform mobile app for expense tracking with 1000+ downloads\n• Integrated with bank APIs for automatic transaction categorization\n• Implemented offline functionality with SQLite and data synchronization\n• Published on both iOS App Store and Google Play Store\n• Technologies: React Native, SQLite, Redux, Firebase, Plaid API",
  
  certifications: "AWS Certified Solutions Architect - Associate | Amazon Web Services | 2022\nCertified Kubernetes Administrator (CKA) | Cloud Native Computing Foundation | 2021\nMicrosoft Certified: Azure Developer Associate | Microsoft | 2020\nGoogle Cloud Professional Developer | Google Cloud | 2019\nScrum Master Certification (CSM) | Scrum Alliance | 2018"
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

  const loadTestProfile = () => {
    setForm(TEST_PROFILE);
    const testJobDescription = "Senior Full Stack Developer - TechCorp Inc.\n\nWe are seeking an experienced Senior Full Stack Developer to join our innovative engineering team. You will be responsible for designing, developing, and maintaining scalable web applications using modern technologies.\n\nKey Responsibilities:\n• Develop and maintain full-stack web applications using React, Node.js, and TypeScript\n• Design and implement RESTful APIs and microservices architecture\n• Work with databases including PostgreSQL, MongoDB, and Redis\n• Collaborate with cross-functional teams including designers, product managers, and DevOps\n• Implement automated testing strategies and CI/CD pipelines\n• Mentor junior developers and conduct code reviews\n• Optimize application performance and ensure scalability\n• Stay up-to-date with emerging technologies and industry best practices\n\nRequired Qualifications:\n• 5+ years of experience in full-stack development\n• Strong proficiency in JavaScript, TypeScript, React, and Node.js\n• Experience with cloud platforms (AWS, Azure, or GCP)\n• Knowledge of containerization technologies (Docker, Kubernetes)\n• Experience with version control systems (Git) and agile methodologies\n• Strong understanding of database design and optimization\n• Excellent problem-solving skills and attention to detail\n• Bachelor's degree in Computer Science or related field\n\nPreferred Qualifications:\n• Experience with GraphQL and Apollo\n• Knowledge of machine learning frameworks\n• Contributions to open-source projects\n• Experience with mobile development (React Native)\n• AWS certifications\n• Experience leading technical projects";
    localStorage.setItem("jobDescription", testJobDescription);
  };

  const fields = [
    { name: "name", label: "Full Name", type: "input", placeholder: "Enter your full name" },
    { name: "email", label: "Email Address", type: "input", placeholder: "your.email@example.com" },
    { name: "phone", label: "Phone Number", type: "input", placeholder: "+1 (555) 123-4567" },
    { name: "experience", label: "Work Experience", type: "textarea", rows: 8, placeholder: "List your work experience with bullet points:\n\n• Job Title | Company | Location | Dates\n• Achievement or responsibility\n• Another achievement with metrics\n\n• Previous Job Title | Company | Location | Dates\n• Key accomplishment\n• Another responsibility" },
    { name: "education", label: "Education", type: "textarea", rows: 4, placeholder: "Degree | University | Location | Year\n• GPA, honors, relevant coursework\n• Additional degrees or certifications" },
    { name: "skills", label: "Technical Skills", type: "textarea", rows: 3, placeholder: "Programming Languages: JavaScript, Python, Java\nFrameworks: React, Node.js, Django\nTools: Git, Docker, AWS" },
    { name: "projects", label: "Projects (Optional)", type: "textarea", rows: 6, placeholder: "Project Name | Technologies Used | Year\n• Brief description of what you built\n• Key features or achievements\n• Impact or results\n\nAnother Project | Tech Stack | Year\n• Description and accomplishments" },
    { name: "certifications", label: "Certifications (Optional)", type: "textarea", rows: 3, placeholder: "AWS Certified Solutions Architect | Amazon | 2023\nGoogle Cloud Professional Developer | Google | 2022\nScrum Master Certification | Scrum Alliance | 2021" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Step 2: Resume Details
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Enter your information below. Don't worry about perfection - our AI will enhance and tailor everything.
            </p>
            
            {/* Test Profile Button */}
            <button
              onClick={loadTestProfile}
              className="bg-green-50 border border-green-200 text-green-600 hover:bg-green-100 px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Load Test Profile (Alexandra Chen - Senior Developer)
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {fields.slice(0, 3).map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={form[field.name]}
                    onChange={onChange}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Professional Information */}
          {fields.slice(3).map((field, index) => (
            <div key={field.name} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  index === 0 ? 'bg-blue-500' : 
                  index === 1 ? 'bg-purple-500' : 
                  index === 2 ? 'bg-orange-500' : 
                  index === 3 ? 'bg-pink-500' : 'bg-indigo-500'
                }`}></div>
                {field.label}
              </h2>
              <div>
                <textarea
                  name={field.name}
                  value={form[field.name]}
                  onChange={onChange}
                  rows={field.rows}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-12">
          <button
            onClick={() => navigate("/job-description")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Job Description</span>
          </button>
          
          <div className="flex gap-4">
            <button
              onClick={() => { localStorage.removeItem("resumeData"); setForm(EMPTY); }}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset All
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Choose Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}