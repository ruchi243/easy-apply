import os
import requests
import re
import hashlib

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")  # or hardcode while testing
MODEL_ID = "meta-llama/llama-3.1-8b-instruct"

def _strip_code_fences(s: str) -> str:
    if "```" not in s:
        return s
    parts = s.split("```")
    # try to select the fenced content if present
    # common patterns: ```latex ... ``` or ```tex ... ```
    # pick the middle chunk
    candidate = parts[1]
    if candidate.strip().startswith(("latex", "tex")):
        candidate = candidate.split("\n", 1)[-1]
    return candidate.strip()

def _preamble_hash(tex: str) -> str:
    # preamble = everything before \begin{document}
    m = re.split(r"\\begin\{document\}", tex, maxsplit=1, flags=re.IGNORECASE)
    preamble = m[0] if m else tex
    return hashlib.sha256(preamble.encode("utf-8")).hexdigest()

def make_jinja_clone_from_template(template_source: str, schema_hint: str) -> str:
    """
    Ask the LLM to return the SAME template with only Jinja guards and variables,
    preserving styling/preamble verbatim. We enforce a hash check.
    """
    pre_hash = _preamble_hash(template_source)

    prompt = f"""
You are given a LaTeX resume template. Your job:
- Return the SAME LaTeX file as a Jinja2 template.
- Preserve the preamble, packages, geometry, and layout VERBATIM.
- You may ONLY add Jinja2 conditionals/loops to make sections optional and loopable.
- Use the variables/structures from the schema (names must match). Do not rename keys.
- Every variable expansion must be escaped in LaTeX via the Jinja filter: {{ var|escapelatex }}.
- DO NOT add or remove LaTeX packages or change styling commands.
- DO NOT add explanations or markdown; return ONLY the template source.

Schema (use exactly these keys; empty means the section should be surrounded by a Jinja if):
{schema_hint}

Original Template:
<<<TEMPLATE
{template_source}
TEMPLATE
>>>
"""

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",
        "X-Title": "LazyApply Template Preserver"
    }
    data = {
        "model": MODEL_ID,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.1
    }

    r = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data, timeout=90)
    r.raise_for_status()
    out = r.json()["choices"][0]["message"]["content"]
    out = _strip_code_fences(out)

    # Safety: verify preamble is unchanged
    post_hash = _preamble_hash(out)
    if pre_hash != post_hash:
        raise RuntimeError("Template preamble changed by LLM — rejecting for safety.")

    return out
