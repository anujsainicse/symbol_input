# PowerShell script to start both frontend and backend
Write-Host "Starting Crypto Symbols Manager..." -ForegroundColor Green

# Start backend
Write-Host "Starting backend on port 8001..." -ForegroundColor Yellow
$backend = Start-Process -FilePath "cmd" -ArgumentList "/c", "cd backend && uvicorn app.main:app --reload --port 8001" -PassThru -WindowStyle Hidden

# Start frontend  
Write-Host "Starting frontend on port 3001..." -ForegroundColor Yellow
$env:PORT = "3001"
$frontend = Start-Process -FilePath "cmd" -ArgumentList "/c", "cd frontend && npm start" -PassThru -WindowStyle Hidden

Write-Host "Both servers are running!" -ForegroundColor Green
Write-Host "Backend: http://localhost:8001" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Red

# Handle Ctrl+C to cleanup processes
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    Stop-Process -Id $backend.Id -Force -ErrorAction SilentlyContinue
    Stop-Process -Id $frontend.Id -Force -ErrorAction SilentlyContinue
    Write-Host "Servers stopped." -ForegroundColor Green
}