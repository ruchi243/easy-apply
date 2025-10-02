# Smart Resume Builder

A professional resume builder application that creates ATS-optimized resumes using AI-powered content enhancement and LaTeX templates.

## Features

- **ATS Optimization**: Intelligent keyword matching and formatting for applicant tracking systems
- **AI Enhancement**: Content improvement and job-specific tailoring using advanced language models
- **Real-time Scoring**: Live feedback on resume effectiveness with detailed keyword analysis
- **Professional Templates**: Multiple ATS-friendly designs for different industries and career levels
- **PDF Generation**: High-quality LaTeX-generated PDFs with professional formatting

## Technology Stack

### Frontend
- React 19.1.0
- Vite 7.0.4
- Tailwind CSS 4.1.11
- React Router DOM 7.7.1

### Backend
- FastAPI 0.111.0
- Python 3.11+
- LaTeX (MiKTeX/TeX Live)
- Jinja2 3.1.4
- OpenRouter API integration

## Installation

### Prerequisites
- Node.js 16+
- Python 3.11+
- LaTeX distribution (MiKTeX on Windows, TeX Live on Mac/Linux)
- OpenRouter API key

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd latex-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Environment Variables
Create a `.env` file in the `latex-backend` directory:
```
OPENROUTER_API_KEY=your_api_key_here
```

## Usage

1. **Job Description**: Paste the target job description for ATS optimization
2. **Resume Details**: Enter your professional information and experience
3. **Template Selection**: Choose from multiple professional templates
4. **Preview & Generate**: Review ATS score and download your optimized PDF

## Templates

- **Classic Professional**: Traditional ATS-friendly format
- **Modern Academic**: Contemporary design with project highlights
- **Research Scholar**: Academic-focused with publications and services
- **Simple & Clean**: Minimalist design focusing on content

## API Endpoints

- `GET /health` - Health check
- `POST /render` - Generate PDF from resume data

## Development

### Project Structure
```
smart-resume-builder/
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   └── utils/              # Utility functions
├── latex-backend/          # FastAPI backend
│   ├── templates/          # LaTeX templates
│   ├── main.py            # FastAPI application
│   └── render.py          # PDF generation logic
└── public/                 # Static assets
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub or contact the development team.