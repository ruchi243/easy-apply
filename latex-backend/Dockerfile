# Start with Python 3.12 to avoid PyO3 issues
FROM python:3.12-slim

# Install TeX Live and build tools
RUN apt-get update && apt-get install -y \
    texlive-full \
    build-essential \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first for caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Start the FastAPI app
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
