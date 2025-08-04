# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Full-stack Development
```bash
# Install all dependencies (backend + frontend)
npm run install-all

# Start both backend and frontend in development mode
npm run dev
```

### Docker Development
```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Backend Only (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend Only (React + TypeScript)
```bash
cd frontend
npm install
npm start
```

### Testing
```bash
# Frontend tests
cd frontend
npm test

# Backend - no test framework configured
```

### Build
```bash
# Frontend production build
cd frontend
npm run build
```

## Architecture Overview

This is a full-stack cryptocurrency symbols management application that generates text files for price fetching programs.

### Technology Stack
- **Backend**: FastAPI (Python) with file-based storage
- **Frontend**: React with TypeScript and TailwindCSS
- **Data Storage**: JSON files (no database)
- **Deployment**: Docker with docker-compose

### Backend Structure (`backend/`)
- **`app/main.py`**: FastAPI application entry point with CORS configuration
- **`app/models/symbols.py`**: Pydantic models for DEX and CEX symbols with validation
- **`app/routers/`**: API endpoints split by functionality:
  - `dex.py`: DEX symbol management endpoints
  - `cex.py`: CEX symbol management endpoints  
  - `files.py`: File generation and download endpoints
- **`app/utils/file_manager.py`**: File operations and backup management
- **`data/`**: JSON storage files and automatic backups

### Frontend Structure (`frontend/`)
- **`src/pages/`**: Main application pages:
  - `Landing.tsx`: Dashboard with statistics
  - `DEXManagement.tsx`: DEX symbols CRUD interface
  - `CEXManagement.tsx`: CEX symbols CRUD interface
- **`src/components/`**: Reusable UI components
- **`src/services/api.ts`**: API client using axios
- **`src/types/symbols.ts`**: TypeScript type definitions

### Data Flow
1. User manages symbols through React frontend
2. API calls to FastAPI backend endpoints
3. Backend validates data using Pydantic models
4. Data stored in JSON files with automatic backups
5. Text files (`pooladdress.txt`, `cex_symbols.txt`) generated immediately
6. Files available for download or direct use by trading programs

### Key Features
- **File-based storage**: No database setup required
- **Automatic backups**: Created before any data changes
- **Real-time generation**: Output files update immediately when symbols change
- **Validation**: Ethereum address validation for DEX, ticker format validation for CEX
- **Supported exchanges**: Multiple CEX and DEX types with dropdown selection

### Development Ports
- Backend API: `http://localhost:8000` (Docker) or `http://localhost:8001` (manual)
- Frontend: `http://localhost:3000` (Docker) or `http://localhost:3001` (manual)
- API Documentation: `http://localhost:8000/docs`

### File Generation Logic
- **DEX symbols** → `pooladdress.txt` (format: `dex_type:pool_address:pool_name:altcoin_quantity`)
- **CEX symbols** → `cex_symbols.txt` (format: `TICKER:exchange_name`)

### Common Development Patterns
- Use existing exchange validation lists in CEX management
- Follow established validation patterns for new symbol types
- Maintain backup system for any data modifications
- Keep frontend and backend models synchronized