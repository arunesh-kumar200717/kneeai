"""
Knee AI — Backend Startup Script
Runs the FastAPI server that executes the 2D U-Net model from module2.ipynb
"""

import sys
import subprocess
import os

def main():
    backend_dir = os.path.join(os.path.dirname(__file__), "backend")
    server_file = os.path.join(backend_dir, "server.py")

    print("=" * 60)
    print("  Knee AI — Deep Learning Inference Backend")
    print("  Model Architecture: 2D U-Net from module2.ipynb")
    print("  Serving endpoints:")
    print("    - POST http://localhost:8000/api/knee/analyze")
    print("    - POST http://localhost:8000/api/meniscus/analyze")
    print("    - GET  http://localhost:8000/health")
    print("=" * 60)

    try:
        import uvicorn
        import fastapi
        print("\nFastAPI & Uvicorn found. Starting server...\n")
        uvicorn.run("backend.server:app", host="127.0.0.1", port=8000, reload=True)
    except ImportError:
        print("\nInstalling required backend dependencies from backend/requirements.txt...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"])
        print("\nStarting server...")
        import uvicorn
        uvicorn.run("backend.server:app", host="127.0.0.1", port=8000, reload=True)

if __name__ == "__main__":
    main()
