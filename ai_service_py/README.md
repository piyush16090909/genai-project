# AI Service (Python)

This service is intentionally placed at the repo root:

- d:/genaiproject/ai_service_py

The Node backend calls this service through HTTP using AI_SERVICE_URL (default: http://localhost:8001).

## Quick Start (Windows PowerShell)

1. Open terminal in d:/genaiproject/ai_service_py
2. Create and activate venv:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
```

3. Install dependencies:

```powershell
pip install -r requirements.txt
```

4. Run API server:

```powershell
python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

5. Health check:

```powershell
Invoke-WebRequest http://localhost:8001/health
```

## Environment Variables

The service now auto-loads environment values from the first existing file in this order:

1. ai_service_py/.env
2. ../.env
3. ../backend/.env

Required key:

- MISTRAL_API_KEY

Optional keys:

- MISTRAL_MODEL
- MISTRAL_TIMEOUT_MS

## Recommended Project Run Order

1. Start MongoDB connectivity (if needed by backend)
2. Start backend on port 3000
3. Start frontend on port 5173
4. Start this AI service on port 8001

As long as backend AI_SERVICE_URL points to http://localhost:8001, the location of this folder is fine.
