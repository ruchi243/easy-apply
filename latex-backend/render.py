import os, tempfile, subprocess, shutil, requests, json
from fastapi import HTTPException
from jinja2 import Environment, BaseLoader, select_autoescape, FileSystemLoader
from llm_cleaner import clean_resume_with_llm
from llm_template_preserver import make_jinja_clone_from_template
from schema import SCHEMA_HINT

def escape_latex(s: str) -> str:
    if not s:
        return ""
    repl = {
        '\\': r'\textbackslash{}', '&': r'\&', '%': r'\%', '$': r'\$',
        '#': r'\#', '_': r'\_', '{': r'\{', '}': r'\}', '~': r'\textasciitilde{}',
        '^': r'\^{}',
    }
    for k, v in repl.items():
        s = s.replace(k, v)
    return s

def render_pdf(payload: dict, template_id: str = "modern"):
    resume_data = payload.get("resumeData", payload)
    job_description = payload.get("jobDescription", "")

    # 1) Improve content truthfully (same keys)
    try:
        enhanced = clean_resume_with_llm(resume_data, job_description, model="mistralai/mistral-7b-instruct")
    except Exception as e:
        raise HTTPException(500, f"LLM content cleaner failed: {e}")

    # 2) Load the original, chosen template source
    templates_dir = os.path.join(os.path.dirname(__file__), "templates")
    template_map = {
        "simple": "simple.tex.j2",
        "classic": "classic.tex.j2",
        "modern": "modern.tex.j2",
        "research": "research.tex.j2",
    }
    if template_id not in template_map:
        raise HTTPException(400, f"Invalid template ID: {template_id}")

    original_path = os.path.join(templates_dir, template_map[template_id])
    with open(original_path, "r", encoding="utf-8") as f:
        original_source = f.read()

    # 3) Build structured JSON matching the template, then render Jinja with LaTeX-escaping
    try:
        structured = _llm_struct_for_template(
            template_id=template_id,
            raw_text_data=enhanced,
            job_description=job_description,
        )
    except Exception as e:
        raise HTTPException(500, f"LLM structuring failed: {e}")

    env = Environment(
        loader=FileSystemLoader(templates_dir),
        autoescape=select_autoescape([]),
        trim_blocks=True,
        lstrip_blocks=True,
    )
    env.filters["escapelatex"] = escape_latex
    template = env.get_template(template_map[template_id])
    try:
        tex_source = template.render(**structured)
    except Exception as e:
        raise HTTPException(400, f"Template render error: {e}")

    # 5) Compile to PDF
    workdir = tempfile.mkdtemp(prefix="latex_")
    try:
        tex_path = os.path.join(workdir, "resume.tex")
        with open(tex_path, "w", encoding="utf-8") as f:
            f.write(tex_source)

        compile_cmd = [
            "pdflatex",
            "-interaction=nonstopmode",
            "-halt-on-error",
            "resume.tex",
        ]
        try:
            # First pass is usually sufficient; run twice for references
            subprocess.run(compile_cmd, cwd=workdir, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, check=True)
            subprocess.run(compile_cmd, cwd=workdir, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, check=True)
        except subprocess.CalledProcessError as e:
            log_path = os.path.join(workdir, "resume.log")
            log_tail = ""
            if os.path.exists(log_path):
                try:
                    with open(log_path, "r", encoding="utf-8", errors="ignore") as lf:
                        log = lf.read()
                        # Keep last 200 lines for brevity
                        log_tail = "\n".join(log.splitlines()[-200:])
                except Exception:
                    pass
            raise HTTPException(400, f"LaTeX compilation failed. Last log lines:\n{log_tail}")

        pdf_path = os.path.join(workdir, "resume.pdf")
        with open(pdf_path, "rb") as f:
            return f.read()
    finally:
        # while debugging, you can print(workdir) and inspect files
        shutil.rmtree(workdir, ignore_errors=True)


def _llm_fill_template_with_data(template_source: str, filled_data: dict, job_description: str) -> str:
    """Deprecated path: kept for reference. Not used after switching back to Jinja rendering."""
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError(
            "OPENROUTER_API_KEY is not set in environment."
        )

    # Keep the preamble frozen: everything before \begin{document}
    def _preamble(tex: str) -> str:
        parts = tex.split("\\begin{document}", 1)
        return parts[0] if parts else tex

    preamble_before = _preamble(template_source)

    system = (
        "You are a precise LaTeX resume generator. Return ONLY LaTeX source. "
        "Do not include markdown fences or commentary."
    )
    user = (
        "Fill this LaTeX resume template with the provided JSON data.\n"
        "- Preserve the preamble, packages, and layout VERBATIM.\n"
        "- Replace any Jinja or placeholders with actual text from the JSON.\n"
        "- Escape user text for LaTeX where needed.\n"
        "- Do not change styling or add new packages.\n"
        "- Output must be a complete compilable LaTeX document.\n\n"
        f"Job Description (for tone only; don’t invent facts):\n{job_description}\n\n"
        f"Resume Data (JSON):\n{json.dumps(filled_data, ensure_ascii=False, indent=2)}\n\n"
        "LaTeX Template:\n<<<TEMPLATE\n"
        + template_source +
        "\nTEMPLATE\n>>>\n"
    )

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",
        "X-Title": "Smart Resume Builder",
    }
    body = {
        "model": "meta-llama/llama-3.1-8b-instruct",
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "temperature": 0.2,
    }

    r = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=body, timeout=90)
    if r.status_code != 200:
        raise RuntimeError(f"OpenRouter error {r.status_code}: {r.text}")

    content = r.json()["choices"][0]["message"]["content"] or ""
    # Strip code fences if present
    if "```" in content:
        parts = content.split("```")
        # take the middle part and drop any language tag
        if len(parts) >= 2:
            candidate = parts[1].strip()
            if candidate.lower().startswith(("latex", "tex")):
                candidate = candidate.split("\n", 1)[-1]
            content = candidate.strip()

    # Safety: ensure preamble unchanged (tolerate whitespace/comment differences)
    def _normalize_preamble(tex: str) -> str:
        # strip comments and whitespace for comparison
        lines = []
        for line in tex.splitlines():
            # remove comments (but not in verbatim; assume not used in preamble)
            if "%" in line:
                line = line.split("%", 1)[0]
            lines.append(line.strip())
        normalized = "".join(lines)
        return normalized

    generated_preamble = content.split("\\begin{document}", 1)[0] if content else ""
    if preamble_before and generated_preamble:
        if _normalize_preamble(preamble_before) != _normalize_preamble(generated_preamble):
            # Enforce original preamble by splicing it onto the model's body
            after = content.split("\\begin{document}", 1)
            tail = ""
            if len(after) == 2:
                # keep from \begin{document} onward from model output
                tail = "\\begin{document}" + after[1]
            else:
                # if model forgot begin{document}, just append the rest
                tail = content
            content = preamble_before + tail

    return content


def _llm_struct_for_template(template_id: str, raw_text_data: dict, job_description: str) -> dict:
    """
    Ask the model to convert flat/raw resume fields into a JSON structure that the
    selected template expects. Returns a Python dict. Strictly JSON-only output.
    """
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY is not set in environment.")

    # Provide a template-specific schema example (classic/modern/research/simple)
    if template_id == "classic":
        schema_hint = {
            "name": "string",
            "email": "string",
            "phone": "string",
            "linkedin": "string (optional, URL)",
            "github": "string (optional, URL)",
            "education": [
                {
                    "school": "string",
                    "location": "string",
                    "degree": "string",
                    "dates": "string"
                }
            ],
            "experience": [
                {
                    "title": "string",
                    "company": "string",
                    "location": "string",
                    "dates": "string",
                    "details": ["string", "string"]
                }
            ],
            "projects": [
                {
                    "name": "string",
                    "dates": "string",
                    "stack": "string",
                    "details": ["string", "string"]
                }
            ],
            "skills": {
                "languages": "string",
                "frameworks": "string",
                "tools": "string",
                "libraries": "string"
            }
        }
    elif template_id == "modern":
        schema_hint = {
            "name": "string",
            "email": "string",
            "phone": "string",
            "website": "string (optional, URL)",
            "identity": "string (optional; e.g., Software Engineer)",
            "education": [
                {
                    "school": "string",
                    "location": "string",
                    "degree": "string",
                    "duration": "string (preferred) or dates",
                    "dates": "string (fallback)",
                    "notes": ["string"]
                }
            ],
            "projects": [
                {
                    "title": "string (or use name)",
                    "name": "string (fallback)",
                    "sponsor": "string (optional)",
                    "dates": "string (optional)",
                    "stack": "string (optional)",
                    "details": ["string"]
                }
            ],
            "internships": [
                {
                    "company": "string",
                    "location": "string",
                    "duration": "string",
                    "tasks": ["string"]
                }
            ],
            "awards": [
                {"title": "string", "source": "string (optional)", "date": "string (optional)"}
            ],
            "skills": [
                {"category": "string", "items": "string"}
            ]
        }
    elif template_id == "research":
        schema_hint = {
            "name": "string",
            "email": "string",
            "phone": "string",
            "website": "string (optional, URL)",
            "degree": "string (optional; displayed near name)",
            "education": [
                {
                    "institution": "string",
                    "location": "string",
                    "degree": "string",
                    "duration": "string (preferred) or dates",
                    "dates": "string (fallback)",
                    "notes": ["string"]
                }
            ],
            "projects": [
                {
                    "title": "string",
                    "sponsor": "string (optional)",
                    "period": "string (preferred) or dates",
                    "dates": "string (fallback)",
                    "details": ["string"]
                }
            ],
            "internships": [
                {
                    "company": "string",
                    "location": "string",
                    "duration": "string",
                    "points": ["string"]
                }
            ],
            "awards": [
                {"title": "string", "detail": "string (optional)", "date": "string (optional)"}
            ],
            "skills": [
                {"name": "string", "tools": "string"}
            ],
            "services": [
                {"label": "string", "detail": "string"}
            ]
        }
    elif template_id == "simple":
        # Use a generic, minimal schema compatible with a simple sections template
        schema_hint = {
            "name": "string",
            "email": "string",
            "phone": "string",
            "summary": "string (optional)",
            "skills": ["string"],
            "experience": [
                {
                    "role": "string",
                    "company": "string",
                    "location": "string",
                    "start": "string",
                    "end": "string",
                    "bullets": ["string"]
                }
            ],
            "projects": [
                {"name": "string", "tech": ["string"], "bullets": ["string"]}
            ],
            "education": [
                {"degree": "string", "school": "string", "year": "string"}
            ],
            "certifications": ["string"]
        }
    else:
        # Fallback to generic schema
        schema_hint = SCHEMA_HINT

    system = (
        "You are a resume structuring assistant. Return ONLY valid JSON."
    )
    user = (
        "Convert these raw resume fields into the JSON structure required by the given schema.\n"
        "- Improve wording lightly for clarity and impact based on the job description.\n"
        "- Do NOT invent facts.\n"
        "- Keep values as plain text (no LaTeX).\n"
        "- Ensure all required keys exist; use empty strings or empty arrays where not available.\n"
        f"Job Description:\n{job_description}\n\n"
        f"Raw Resume Data (may be flat strings):\n{json.dumps(raw_text_data, ensure_ascii=False, indent=2)}\n\n"
        f"Schema (shape to match exactly):\n{json.dumps(schema_hint, ensure_ascii=False, indent=2)}\n"
    )

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",
        "X-Title": "Smart Resume Builder (Structuring)",
    }
    body = {
        "model": "meta-llama/llama-3.1-8b-instruct",
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "temperature": 0.2,
        "response_format": {"type": "json_object"}
    }

    r = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=body, timeout=90)
    if r.status_code != 200:
        raise RuntimeError(f"OpenRouter error {r.status_code}: {r.text}")

    content = r.json()["choices"][0]["message"]["content"] or "{}"
    try:
        data = json.loads(content)
    except Exception:
        # simple fence strip fallback
        if "```" in content:
            parts = content.split("```")
            if len(parts) >= 2:
                candidate = parts[1]
                if candidate.strip().lower().startswith(("json",)):
                    candidate = candidate.split("\n", 1)[-1]
                data = json.loads(candidate)
            else:
                raise
        else:
            raise

    if not isinstance(data, dict):
        raise RuntimeError("Model structuring did not return a JSON object.")
    return data
