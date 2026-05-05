# Smart Resume Builder

Paste a job description. Get a tailored resume in seconds.

Most people spend 30 to 45 minutes manually tweaking their resume for every 
application. Smart Resume Builder does it in one click , AI reads the job 
description, matches your experience to what actually matters, and generates 
a clean LaTeX-formatted PDF ready to send.

## what it does

- Takes a job description as input
- Identifies keywords, required skills, and role priorities
- Restructures and tailors your resume content to match
- Outputs a professionally formatted LaTeX PDF
- Cuts manual editing time by approximately 50%
## architecture 

<img width="1440" height="1124" alt="image" src="https://github.com/user-attachments/assets/dd5f23cc-9f5d-4902-ab0d-20d243512c29" />

## tech stack

- **Frontend** : React, Tailwind CSS
- **Backend** : FastAPI, Python
- **Document generation** : LaTeX
- **AI layer** : keyword extraction and section prioritization

## try it live

[smart-resume-builder-puce.vercel.app](https://smart-resume-builder-puce.vercel.app/)

## run it locally

```bash
git clone https://github.com/ruchi243/easy-apply
cd easy-apply

# backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# frontend
cd ../frontend
npm install
npm run dev
```

## demo

Video demo coming soon.

---

built by [Ruchi Kolte](mailto:rkolte@asu.edu)
