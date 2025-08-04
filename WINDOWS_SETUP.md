# Windows Installation Guide

A complete guide to run Crypto Symbols Manager on Windows using Docker.

## Prerequisites

### System Requirements
- **Windows 10/11** (64-bit) - Pro, Enterprise, or Education edition recommended
- **8GB RAM** minimum (16GB recommended for better performance)
- **10GB free disk space** for Docker and application
- **Administrator privileges** for Docker Desktop installation

### Required Software
- **Docker Desktop** - The only requirement! No Python, Node.js, or other dependencies needed.

## Step-by-Step Installation

### Step 1: Enable Windows Features

Before installing Docker Desktop, enable the required Windows features:

1. **Open Windows Features**:
   - Press `Windows + R`, type `optionalfeatures` and press Enter
   - Or go to: Control Panel → Programs → Turn Windows features on or off

2. **Enable these features** (check the boxes):
   - ✅ **Hyper-V** (if available)
   - ✅ **Windows Subsystem for Linux (WSL)**
   - ✅ **Virtual Machine Platform**

3. **Restart your computer** when prompted

### Step 2: Install WSL 2

Open **Command Prompt as Administrator** and run:

```cmd
wsl --install
```

If WSL is already installed, update it:
```cmd
wsl --update
```

### Step 3: Enable Virtualization in BIOS

If Docker fails to start, you may need to enable virtualization:

1. **Restart your computer**
2. **Enter BIOS/UEFI** (usually F2, F12, Delete, or Esc during startup)
3. **Look for**: "Virtualization Technology", "Intel VT-x", or "AMD-V"
4. **Enable** the virtualization option
5. **Save and exit** BIOS

### Step 4: Install Docker Desktop

1. **Download Docker Desktop**:
   - Go to: https://www.docker.com/products/docker-desktop/
   - Click "Download for Windows"

2. **Run the installer**:
   - Double-click the downloaded `.exe` file
   - Follow the installation wizard
   - Accept the license agreement
   - Choose "Use WSL 2 instead of Hyper-V" if prompted

3. **Restart your computer** when installation completes

4. **Start Docker Desktop**:
   - Find Docker Desktop in Start Menu and launch it
   - Wait for Docker to start (whale icon appears in system tray)
   - Accept the Docker Subscription Service Agreement if prompted

5. **Verify installation**:
   ```cmd
   docker --version
   docker-compose --version
   ```

### Step 5: Download the Project

Choose one of these methods:

#### Option A: Download ZIP File
1. Download the project ZIP file from the source
2. Extract to a folder like `C:\crypto-symbols-manager`
3. Open Command Prompt and navigate to the folder:
   ```cmd
   cd C:\crypto-symbols-manager
   ```

#### Option B: Clone with Git (if you have Git)
```cmd
git clone <repository-url>
cd crypto-symbols-manager
```

### Step 6: Run the Application

1. **Open Command Prompt or PowerShell**
2. **Navigate to project directory**:
   ```cmd
   cd C:\crypto-symbols-manager
   ```

3. **Build and start the application**:
   ```cmd
   docker-compose up --build
   ```

4. **Wait for startup** (first time takes 2-5 minutes to download and build)

5. **Look for these success messages**:
   ```
   crypto-symbols-backend   | INFO:     Uvicorn running on http://0.0.0.0:8000
   crypto-symbols-frontend  | Configuration complete; ready for start up
   ```

6. **Access the application**:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs

## Using the Application

### Managing the Application

```cmd
# Stop the application (Ctrl+C in the running terminal)
# Or in a new Command Prompt:
docker-compose down

# Start again (faster after first build)
docker-compose up

# Start in background (runs without blocking terminal)
docker-compose up -d

# View logs when running in background
docker-compose logs -f

# Stop background services
docker-compose down
```

### Application Features

1. **Dashboard**: Overview of your symbols and file status
2. **DEX Management**: Add Uniswap/SushiSwap pool addresses
3. **CEX Management**: Add exchange ticker symbols
4. **File Generation**: Automatic creation of configuration files
5. **File Download**: Download generated files for your trading systems

### Supported Exchanges
- Binance, BingX, BitMart, Bitstamp, Bitunix
- Bybit, Gate.io, HTX, KuCoin, LBank, MEXC

### Supported DEX Types
- Uniswap V2, Uniswap V3, SushiSwap V2, SushiSwap V3

## Troubleshooting

### Docker Desktop Issues

#### Problem: "Docker Desktop failed to start"
**Solutions:**
1. **Restart Docker Desktop**:
   - Right-click Docker icon in system tray → Quit Docker Desktop
   - Start Docker Desktop again

2. **Check Windows Features**:
   - Ensure Hyper-V and WSL are enabled (see Step 1)

3. **Enable Virtualization**:
   - Check BIOS settings (see Step 3)

4. **Reset Docker Desktop**:
   - Right-click Docker icon → Troubleshoot → Reset to factory defaults

#### Problem: "WSL 2 installation is incomplete"
**Solution:**
```cmd
# Run as Administrator
wsl --install
wsl --set-default-version 2
```

### Application Issues

#### Problem: Port conflicts (3000 or 8000 already in use)
**Check what's using the ports:**
```cmd
netstat -an | findstr :3000
netstat -an | findstr :8000
```

**Kill conflicting processes:**
```cmd
taskkill /F /PID <process-id>
```

#### Problem: "Cannot connect to Docker daemon"
**Solutions:**
1. Make sure Docker Desktop is running (whale icon in system tray)
2. Restart Docker Desktop
3. Run Command Prompt as Administrator

#### Problem: Build fails or containers won't start
**Clean rebuild:**
```cmd
docker-compose down
docker system prune -a
docker-compose up --build
```

### Performance Issues

#### Problem: Slow performance
**Solutions:**
1. **Allocate more resources to Docker**:
   - Right-click Docker icon → Settings → Resources
   - Increase Memory to 4GB+ and CPUs to 2+

2. **Close unnecessary applications** while Docker is running

3. **Use SSD storage** if possible for better performance

### Firewall Issues

#### Problem: Windows Firewall blocking Docker
**Solution:**
- When prompted, click "Allow access" for Docker Desktop
- Or manually add Docker to Windows Firewall exceptions

### Network Issues

#### Problem: Cannot access application at localhost:3000
**Solutions:**
1. **Check if containers are running**:
   ```cmd
   docker-compose ps
   ```

2. **Check container logs**:
   ```cmd
   docker-compose logs frontend
   docker-compose logs backend
   ```

3. **Try different browser** or incognito mode

4. **Disable VPN** temporarily if using one

## Updating the Application

When you receive updates to the application:

1. **Stop current services**:
   ```cmd
   docker-compose down
   ```

2. **Download/replace updated files**

3. **Rebuild and restart**:
   ```cmd
   docker-compose up --build
   ```

## Uninstalling

To completely remove the application:

1. **Stop and remove containers**:
   ```cmd
   docker-compose down -v
   ```

2. **Remove Docker images**:
   ```cmd
   docker system prune -a
   ```

3. **Delete project folder**

4. **Uninstall Docker Desktop** (optional):
   - Control Panel → Programs → Uninstall Docker Desktop

## Development Mode

For developers who want to make changes:

1. **Make code changes** in the project files

2. **Rebuild specific service**:
   ```cmd
   # Rebuild frontend only
   docker-compose build frontend
   
   # Rebuild backend only
   docker-compose build backend
   ```

3. **Restart services**:
   ```cmd
   docker-compose up
   ```

## Data Persistence

Your cryptocurrency symbols and configuration data are automatically saved and persist between restarts. Data is stored in Docker volumes and will survive container restarts and updates.

**Backup your data:**
```cmd
docker-compose exec backend cp -r /app/data /tmp/backup
```

## Support

### Common Issues Summary

| Issue | Solution |
|-------|----------|
| Docker won't start | Enable virtualization in BIOS, enable Windows features |
| Port conflicts | Check `netstat`, kill conflicting processes |
| Build failures | Run `docker system prune -a` and rebuild |
| Slow performance | Allocate more resources to Docker |
| Cannot access app | Check firewall, try different browser |

### Getting Help

1. **Check Docker Desktop logs**: Right-click Docker icon → Troubleshoot
2. **View application logs**: `docker-compose logs -f`
3. **Restart everything**: `docker-compose down && docker-compose up --build`
4. **Reset Docker**: Right-click Docker icon → Troubleshoot → Reset to factory defaults

## Advanced Configuration

### Custom Ports

If you need to use different ports, edit `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"  # Frontend on port 8080
  - "9000:8000"  # Backend on port 9000
```

### Resource Limits

To limit Docker resource usage, add to `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      memory: 2G
      cpus: '1.0'
```

This guide should get you running successfully on Windows! The Docker approach eliminates most Windows-specific issues and provides a consistent experience across all Windows versions.