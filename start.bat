@echo off
echo Starting backend...
start /B cmd /c "cd backend && uvicorn app.main:app --reload --port 8001"

echo Starting frontend...
start /B cmd /c "cd frontend && set PORT=3001 && npm start"

echo Both servers are running.
echo Backend: http://localhost:8001
echo Frontend: http://localhost:3001
echo Press Ctrl+C to stop both.

pause