# Crypto Symbols Manager

A full-stack web application for managing cryptocurrency symbols that generates text files for existing price fetching programs. Uses simple file-based storage - no database required.

## Features

- **DEX Symbol Management**: Configure Uniswap and SushiSwap pool addresses
- **CEX Symbol Management**: Manage centralized exchange ticker symbols
- **Automatic File Generation**: Creates `pooladdress.txt` and `cex_symbols.txt` files
- **File-Based Storage**: No database required, uses JSON files
- **Real-time Updates**: Changes immediately update generated files
- **Backup System**: Automatic backups before any changes
- **Modern Dark UI**: Professional dark theme with glass-morphism effects
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Project Structure

```
crypto-symbols-manager/
├── backend/          # FastAPI Python backend
│   ├── app/
│   │   ├── models/   # Pydantic data models
│   │   ├── routers/  # API endpoints
│   │   └── utils/    # File management utilities
│   └── data/         # File-based storage
│       ├── dex_symbols.json
│       ├── cex_symbols.json
│       └── backups/
├── frontend/         # React TypeScript frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       └── types/
├── start.bat         # Windows batch script
├── start.ps1         # Windows PowerShell script
└── start.sh          # Unix/Mac shell script
```

## Prerequisites

### Option 1: Docker (Recommended for Windows)
- **Docker Desktop** - Download from [docker.com](https://www.docker.com/products/docker-desktop/)
- **Git** (optional) - Download from [git-scm.com](https://git-scm.com/)

### Option 2: Manual Installation
- **Node.js** (v16 or higher) - Download from [nodejs.org](https://nodejs.org/)
- **Python** (v3.8 or higher) - Download from [python.org](https://python.org/)
- **Git** (optional) - Download from [git-scm.com](https://git-scm.com/)

### Verify Installation
```cmd
# For Docker
docker --version
docker-compose --version

# For Manual Installation  
node --version
npm --version
python --version
pip --version
```

## Installation & Setup

### Option 1: Docker Setup (Recommended)

#### 1. Download the Project
```cmd
# If using Git
git clone <repository-url>
cd crypto-symbols-manager

# Or download and extract the ZIP file
```

#### 2. Run with Docker Compose
```cmd
# Build and start both services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up --build -d

# View logs (if running in detached mode)
docker-compose logs -f

# Stop the services
docker-compose down
```

#### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### Option 2: Manual Setup

#### 1. Download the Project
```cmd
# If using Git
git clone <repository-url>
cd crypto-symbols-manager

# Or download and extract the ZIP file
```

#### 2. Install Backend Dependencies
```cmd
cd backend
pip install -r requirements.txt
cd ..
```

#### 3. Install Frontend Dependencies
```cmd
cd frontend
npm install
cd ..
```

#### 4. Run the Application

**Option A: Quick Start (Batch File)**
```cmd
# Double-click start.bat or run in Command Prompt
start.bat
```

**Option B: PowerShell Script**
```powershell
# Right-click start.ps1 → Run with PowerShell
# Or run in PowerShell:
powershell -ExecutionPolicy Bypass -File start.ps1
```

**Option C: Manual Start (Two Terminals)**
```cmd
# Terminal 1 (Backend):
cd backend
uvicorn app.main:app --reload --port 8001

# Terminal 2 (Frontend):
cd frontend
set PORT=3001
npm start
```

## Docker Commands

### Basic Operations
```cmd
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Development Commands
```cmd
# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Restart specific service
docker-compose restart backend
docker-compose restart frontend

# Execute command in running container
docker-compose exec backend bash
docker-compose exec frontend sh
```

### Data Management
```cmd
# View volumes
docker volume ls

# Backup data
docker-compose exec backend cp -r /app/data /tmp/backup

# Clean up (removes containers, networks, and volumes)
docker-compose down -v
docker system prune -a
```

## Windows-Specific Notes

### Docker Desktop Requirements
- **Windows 10/11 Pro, Enterprise, or Education** (64-bit)
- **WSL 2** feature enabled
- **Virtualization** enabled in BIOS
- **Hyper-V** and **Windows Subsystem for Linux** features enabled

### Docker Desktop Installation
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/)
2. Run installer and follow setup wizard
3. Restart computer when prompted
4. Open Docker Desktop and wait for it to start
5. Verify installation: `docker --version`

### Firewall Settings (Manual Installation Only)
- Windows Firewall may prompt to allow Python and Node.js
- Click "Allow access" when prompted

### Port Conflicts
Check if ports are in use:
```cmd
# For Docker (ports 8000, 3000)
netstat -an | findstr :8000
netstat -an | findstr :3000

# For Manual Installation (ports 8001, 3001)
netstat -an | findstr :8001
netstat -an | findstr :3001
```

### PowerShell Execution Policy (Manual Installation Only)
If you get execution policy errors:
```powershell
# Run as Administrator
Set-ExecutionPolicy RemoteSigned
```

### Docker Troubleshooting
```cmd
# If Docker containers won't start
docker-compose down
docker system prune -a
docker-compose up --build

# Check Docker service status
docker info

# Restart Docker Desktop
# Right-click Docker Desktop icon → Restart
```

## Supported Exchanges

### CEX Symbols
- Binance
- BingX
- BitMart
- Bitstamp
- Bitunix
- Bybit
- Gate.io
- HTX
- KuCoin
- LBank
- MEXC

### DEX Types
- Uniswap V2
- Uniswap V3
- SushiSwap V2
- SushiSwap V3

## API Endpoints

### DEX Endpoints
- `GET /api/dex/symbols` - Get all DEX symbols
- `POST /api/dex/symbols` - Add new DEX symbol
- `PUT /api/dex/symbols/{id}` - Update DEX symbol
- `DELETE /api/dex/symbols/{id}` - Delete DEX symbol
- `POST /api/dex/generate-file` - Regenerate pooladdress.txt

### CEX Endpoints
- `GET /api/cex/symbols` - Get all CEX symbols
- `POST /api/cex/symbols` - Add new CEX symbol
- `PUT /api/cex/symbols/{id}` - Update CEX symbol
- `DELETE /api/cex/symbols/{id}` - Delete CEX symbol
- `POST /api/cex/generate-file` - Regenerate cex_symbols.txt

### File Management
- `GET /api/files/download/{file_type}` - Download generated txt files
- `GET /api/files/status` - Get file statistics
- `POST /api/files/backup/create` - Create backup

## Generated File Formats

### DEX File (pooladdress.txt)
```
# Pool addresses for different DEXes
# Format: dex_type:pool_address:pool_name:altcoin_quantity
uniswap_v2:0xA2b04F8133fC25887A436812eaE384e32A8A84F2:COTI:10000
uniswap_v3:0x95A45A87Dd4d3A1803039072f37E075F37B23D75:virtual:500
```

### CEX File (cex_symbols.txt)
```
BTC:binance
ETH:coinbase
DOGE:kraken
```

## Data Validation

- **DEX Symbols**: Ethereum address validation (0x + 40 hex chars)
- **CEX Symbols**: Ticker format validation (2-10 characters, auto-uppercase)
- **Duplicate Prevention**: No duplicate pool addresses or ticker/exchange combinations
- **Exchange Validation**: Only supported exchanges allowed

## Features

### Modern UI
- **Dark Theme**: Professional dark color scheme
- **Glass-morphism**: Modern card designs with backdrop blur
- **Responsive**: Works on all screen sizes
- **Animations**: Smooth transitions and hover effects
- **Gradient Text**: Eye-catching headings
- **Status Badges**: Visual indicators for active symbols

### Data Management
- **Sorting**: DEX symbols by name, CEX symbols by ticker
- **Search/Filter**: Easy symbol management
- **Real-time Updates**: Instant file generation
- **Backup System**: Automatic backups with timestamp
- **File Preview**: View generated files before download

## Troubleshooting

### Common Windows Issues

1. **"Python not found"**
   ```cmd
   # Add Python to PATH during installation
   # Or manually add: C:\Python39\Scripts\;C:\Python39\;
   ```

2. **"Node not found"**
   ```cmd
   # Restart Command Prompt after Node.js installation
   # Or add to PATH: C:\Program Files\nodejs\;
   ```

3. **Port already in use**
   ```cmd
   # Kill processes using the ports
   taskkill /F /IM node.exe
   taskkill /F /IM python.exe
   ```

4. **Permission denied**
   ```cmd
   # Run Command Prompt/PowerShell as Administrator
   ```

5. **Slow startup**
   - Windows Defender may scan files on first run
   - Add project folder to Windows Defender exclusions

## Usage

1. **Start the Application**
   - Run `start.bat` or `start.ps1`
   - Wait for both servers to start (about 10-30 seconds)

2. **Access the Web Interface**
   - Open browser to http://localhost:3001
   - Use the dashboard to manage symbols

3. **Manage DEX Symbols**
   - Add Uniswap/SushiSwap pool addresses
   - Specify altcoin quantities for trading
   - Validate Ethereum addresses automatically

4. **Manage CEX Symbols**
   - Add ticker symbols for supported exchanges
   - Dropdown selection for exchange names
   - Automatic uppercase conversion

5. **Download Files**
   - Generated files update immediately
   - Download from dashboard or direct API
   - Use files in your existing price fetching programs

## File Management

- **Automatic Backups**: Created before any changes
- **Immediate Updates**: Files regenerate on symbol changes
- **Download Integration**: Direct download from web interface
- **File Preview**: View contents before downloading
- **Backup History**: Last 10 backups retained automatically

## Development

### Adding New Exchanges
Edit `frontend/src/pages/CEXManagement.tsx` and add new exchange options to the dropdown.

### Modifying File Formats
Update `backend/app/utils/file_manager.py` methods `generate_dex_file()` and `generate_cex_file()`.

### Styling Changes
Modify `frontend/src/index.css` for global styles or individual component files.

## Support

For issues specific to Windows:
1. Check prerequisites are installed correctly
2. Verify ports 8001 and 3001 are available
3. Run as Administrator if permission issues occur
4. Check Windows Firewall/antivirus settings
5. Ensure execution policy allows PowerShell scripts