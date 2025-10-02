import Navigation from "../components/Navigation";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About Smart Resume Builder
          </h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing job applications with AI-powered resume optimization
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              We believe everyone deserves a fair chance at their dream job. Our AI-powered platform 
              helps job seekers create resumes that not only showcase their skills effectively but 
              also pass through applicant tracking systems with ease.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Simply paste a job description, input your details, choose a template, and let our 
              AI enhance your content to match the role perfectly. Get real-time ATS scoring 
              and keyword optimization suggestions.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-10 h-10 bg-green-600 rounded-lg"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">ATS Optimization</h3>
              <p className="text-gray-600 leading-relaxed">Keyword matching and formatting for ATS systems</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-10 h-10 bg-green-600 rounded-lg"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Enhancement</h3>
              <p className="text-gray-600 leading-relaxed">Intelligent content improvement and tailoring</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-10 h-10 bg-green-600 rounded-lg"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Scoring</h3>
              <p className="text-gray-600 leading-relaxed">Live feedback on resume effectiveness</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-10 h-10 bg-green-600 rounded-lg"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Professional Templates</h3>
              <p className="text-gray-600 leading-relaxed">Multiple designs for different industries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}