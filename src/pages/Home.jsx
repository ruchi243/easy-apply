import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-r from-indigo-50 via-white to-pink-50 text-center">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Smart Resume Builder</h1>
      <p className="text-lg text-gray-600 max-w-xl mb-8">
        Create a beautiful, ATS-optimized LaTeX resume and cover letter — completely free.
      </p>

      <button
        className="px-8 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition-all duration-200"
        onClick={() => navigate("/job-description")}
      >
        Continue Without Login
      </button>

      <p className="mt-6 text-sm text-gray-500 italic">
        No account required. Your data stays local and private.
      </p>
    </div>
  );
}
