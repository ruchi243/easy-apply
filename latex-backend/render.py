import os, subprocess, tempfile, shutil
from jinja2 import Environment, FileSystemLoader, select_autoescape

def escape_latex(s: str) -> str:
    if not s: return ""
    # basic escaping
    repl = {
        '\\': r'\textbackslash{}', '&': r'\&', '%': r'\%', '$': r'\$',
        '#': r'\#', '_': r'\_', '{': r'\{', '}': r'\}', '~': r'\textasciitilde{}',
        '^': r'\^{}',
    }
    for k,v in repl.items():
        s = s.replace(k, v)
    return s

def render_pdf(payload: dict, template_id: str = "simple"):
    """
    payload keys expected:
      name, email, phone, summary, skills, experience, education, certifications, projects
    """
    # jinja env with a latex-escape filter
    templates_dir = os.path.join(os.path.dirname(__file__), "templates")
    env = Environment(
        loader=FileSystemLoader(templates_dir),
        autoescape=select_autoescape([]),
        trim_blocks=True, lstrip_blocks=True,
    )
    env.filters["escapelatex"] = escape_latex

    # choose template (map id -> file)
    template_file = "simple.tex.j2"  # expand later by mapping template_id
    template = env.get_template(template_file)

    # defaults
    data = {
        "name": payload.get("name", ""),
        "email": payload.get("email", ""),
        "phone": payload.get("phone", ""),
        "summary": payload.get("summary", ""),
        "skills": payload.get("skills", ""),
        "experience": payload.get("experience", ""),
        "education": payload.get("education", ""),
        "certifications": payload.get("certifications", ""),
        "projects": payload.get("projects", ""),
    }

    tex_source = template.render(**data)

    # compile in temp dir
    workdir = tempfile.mkdtemp(prefix="latex_")
    try:
        tex_path = os.path.join(workdir, "resume.tex")
        with open(tex_path, "w", encoding="utf-8") as f:
            f.write(tex_source)

        # Run pdflatex twice for good measure
        for _ in range(2):
            subprocess.run(
                ["pdflatex", "-interaction=nonstopmode", "resume.tex"],
                cwd=workdir, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True
            )

        pdf_path = os.path.join(workdir, "resume.pdf")
        with open(pdf_path, "rb") as f:
            return f.read()
    finally:
        shutil.rmtree(workdir, ignore_errors=True)
