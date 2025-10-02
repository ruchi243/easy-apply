# latex-backend/llm_cleaner.py

import os
import json
import re
import requests
from typing import Dict, Any

# ------------ Config ------------
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")  # set in your shell
OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_MODEL = "meta-llama/llama-3.1-8b-instruct"
TIMEOUT_SECS = 60

# These are the exact string fields your current templates use
TEMPLATE_KEYS = [
    "name", "email", "phone",
    "experience", "education", "skills",
    "certifications", "projects",
]

# ------------ Helpers ------------

def _strip_code_fences(s: str) -> str:
    """Remove ```...``` fences and any leading language tag."""
    if "```" not in s:
        return s.strip()
    parts = s.split("```")
    # common shapes: [before, "json\n{...}", after] or [before, "{...}", after]
    for chunk in parts[1:]:
        chunk = chunk.strip()
        if not chunk:
            continue
        # drop language tag if present
        chunk = re.sub(r"^(json|latex|tex)\s*", "", chunk, flags=re.I).strip()
        if chunk:
            return chunk
    return s.strip()

def _escape_control_chars_in_strings(json_text: str) -> str:
    """
    Replace raw control chars inside JSON string literals with escaped forms.
    Keeps everything else as-is (brace structure unchanged).
    """
    out = []
    in_str = False
    escaped = False
    quote = None
    for ch in json_text:
        if not in_str:
            if ch in ('"', "'"):
                in_str = True
                quote = ch
            out.append(ch)
        else:
            if escaped:
                out.append(ch)
                escaped = False
            else:
                if ch == "\\":
                    out.append(ch)
                    escaped = True
                elif ch == quote:
                    out.append(ch)
                    in_str = False
                    quote = None
                elif ch == "\n":
                    out.append("\\n")
                elif ch == "\r":
                    out.append("\\r")
                elif ch == "\t":
                    out.append("\\t")
                else:
                    out.append(ch)
    return "".join(out)

def _first_json_or_raise(text: str) -> Dict[str, Any]:
    """
    Parse JSON from model output:
    1) strip fences, try json.loads
    2) escape raw control chars in strings, try again
    3) fallback: find first {...} block, sanitize, parse
    """
    cleaned = _strip_code_fences(text)

    # 1) direct parse
    try:
        return json.loads(cleaned)
    except Exception:
        pass

    # 2) sanitize control chars in strings
    try:
        sanitized = _escape_control_chars_in_strings(cleaned)
        return json.loads(sanitized)
    except Exception:
        pass

    # 3) fallback: find first JSON object
    m = re.search(r"\{[\s\S]*\}", cleaned)
    if m:
        snippet = _escape_control_chars_in_strings(m.group(0))
        return json.loads(snippet)

    raise ValueError(
        "Model did not return valid JSON. Raw content (first 500 chars):\n"
        + text[:500]
    )

def _to_string(v: Any) -> str:
    """Coerce any value to a plain string for LaTeX-safe templates."""
    if v is None:
        return ""
    if isinstance(v, str):
        return v
    if isinstance(v, (list, tuple)):
        # Join lists as bullet-like lines; Jinja/LaTeX can handle newlines
        return "\n".join(_to_string(x) for x in v if x is not None)
    if isinstance(v, dict):
        # Flatten dicts as key: value lines
        return "\n".join(f"{k}: {_to_string(val)}" for k, val in v.items())
    return str(v)

# ------------ Public API ------------

def clean_resume_with_llm(
    raw_data: Dict[str, Any],
    job_description: str = "",
    model: str = DEFAULT_MODEL
) -> Dict[str, str]:
    """
    Enhance resume content while preserving EXACT keys expected by existing templates.
    Returns dict with TEMPLATE_KEYS, all string values.
    """
    if not OPENROUTER_API_KEY:
        raise RuntimeError(
            "OPENROUTER_API_KEY is not set. In Windows CMD: "
            "  set OPENROUTER_API_KEY=sk-or-XXXX\n"
            "In PowerShell:  $env:OPENROUTER_API_KEY='sk-or-XXXX'"
        )

    # Limit to expected keys and coerce to strings BEFORE sending
    original = {k: _to_string(raw_data.get(k, "")) for k in TEMPLATE_KEYS}

    prompt = f"""
You are an ATS-focused resume editor.

TASK:
- Improve the wording in this resume JSON for clarity, impact, and alignment to the job description.
- DO NOT add or invent facts.
- PRESERVE EXACT KEYS and value types. The output must have the same keys as the input.
- Return ONLY VALID JSON (no markdown, no backticks, no commentary).
- Output values must be PLAIN TEXT (no LaTeX commands); escaping happens later.
- Keep bullet points separated by newline characters (\\n). Do not include raw control characters.

Job Description (for alignment only; never fabricate):
\"\"\"{job_description}\"\"\"

Original Resume JSON (keys to preserve):
{json.dumps(original, indent=2, ensure_ascii=False)}
""".strip()

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",
        "X-Title": "LazyApply",
    }

    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3,
        # some models honor this and stick to JSON
        "response_format": {"type": "json_object"}
    }

    resp = requests.post(
        OPENROUTER_ENDPOINT, headers=headers, json=payload, timeout=TIMEOUT_SECS
    )
    if resp.status_code != 200:
        raise RuntimeError(f"OpenRouter error {resp.status_code}: {resp.text}")

    content = resp.json()["choices"][0]["message"]["content"]

    data = _first_json_or_raise(content)
    if not isinstance(data, dict):
        raise ValueError("Model did not return a JSON object.")

    # Filter to expected keys and coerce to strings
    cleaned = {k: _to_string(data.get(k, original.get(k, ""))) for k in TEMPLATE_KEYS}

    # Ensure all keys exist
    for k in TEMPLATE_KEYS:
        cleaned.setdefault(k, "")

    # Cap pathological lengths
    for k, v in cleaned.items():
        if len(v) > 20000:
            cleaned[k] = v[:20000] + "\n[...]"

    return cleaned
