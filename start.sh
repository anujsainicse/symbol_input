#!/bin/bash

# Start backend
echo "Starting backend..."
(cd backend && uvicorn app.main:app --reload --port 8001) &
BACKEND_PID=$!

# Start frontend
echo "Starting frontend..."
(cd frontend && PORT=3001 npm start) &
FRONTEND_PID=$!

# Function to cleanup processes
cleanup() {
    echo "Stopping processes..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Set up trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

echo "Both servers are running. Press Ctrl+C to stop both."
echo "Backend: http://localhost:8001"
echo "Frontend: http://localhost:3001"

# Wait for processes
wait