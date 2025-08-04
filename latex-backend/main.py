from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from render import render_pdf

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend dev origin
    allow_methods=["*"],
    allow_headers=["*"],
)

class RenderRequest(BaseModel):
    templateId: str = "simple"
    resumeData: dict

@app.post("/render", response_class=None)
def render_endpoint(req: RenderRequest):
    pdf_bytes = render_pdf(req.resumeData, req.templateId)
    # return as raw PDF
    from fastapi.responses import Response
    return Response(content=pdf_bytes, media_type="application/pdf", headers={
        "Content-Disposition": 'attachment; filename="resume.pdf"'
    })

@app.get("/health")
def health():
    return {"ok": True}
