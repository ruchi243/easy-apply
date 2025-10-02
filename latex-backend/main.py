from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse
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


@app.post("/render")
def render_endpoint(req: RenderRequest):
    try:
        print("Received templateId:", req.templateId)
        print("Received resume keys:", list(req.resumeData.keys()))

        pdf_bytes = render_pdf(req.resumeData, req.templateId)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="resume.pdf"'}
        )
    except ValueError as e:
        print("❌ ValueError:", str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})
    except Exception as e:
        print("❌ Internal error:", str(e))
        return JSONResponse(status_code=500, content={"error": "Internal server error"})

@app.get("/health")
def health():
    return {"ok": True}

