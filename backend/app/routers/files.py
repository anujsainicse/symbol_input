from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from datetime import datetime

from app.models.symbols import FileStatus
from app.utils.file_manager import FileManager

router = APIRouter(prefix="/api/files", tags=["Files"])
file_manager = FileManager()

@router.get("/download/{file_type}")
async def download_file(file_type: str):
    """Download generated txt files"""
    if file_type == "pooladdress":
        if file_manager.pooladdress_file.exists():
            return FileResponse(
                path=file_manager.pooladdress_file,
                filename="pooladdress.txt",
                media_type="text/plain"
            )
    elif file_type == "cex_symbols":
        if file_manager.cex_symbols_file.exists():
            return FileResponse(
                path=file_manager.cex_symbols_file,
                filename="cex_symbols.txt",
                media_type="text/plain"
            )
    
    raise HTTPException(status_code=404, detail="File not found")

@router.get("/status", response_model=FileStatus)
async def get_file_status():
    """Get file information and statistics"""
    dex_data = file_manager.read_dex_data()
    cex_data = file_manager.read_cex_data()
    
    return FileStatus(
        dex_symbols_count=len(dex_data.symbols),
        cex_symbols_count=len(cex_data.symbols),
        dex_file_size=file_manager.get_file_size(file_manager.pooladdress_file),
        cex_file_size=file_manager.get_file_size(file_manager.cex_symbols_file),
        last_updated=max(dex_data.last_updated, cex_data.last_updated),
        pooladdress_file_exists=file_manager.pooladdress_file.exists(),
        cex_symbols_file_exists=file_manager.cex_symbols_file.exists()
    )

@router.get("/content/{file_type}")
async def get_file_content(file_type: str):
    """Get file contents as text for preview"""
    if file_type == "pooladdress":
        if file_manager.pooladdress_file.exists():
            with open(file_manager.pooladdress_file, 'r') as f:
                return {"content": f.read()}
    elif file_type == "cex_symbols":
        if file_manager.cex_symbols_file.exists():
            with open(file_manager.cex_symbols_file, 'r') as f:
                return {"content": f.read()}
    
    raise HTTPException(status_code=404, detail="File not found")

@router.post("/backup/create")
async def create_backup():
    """Create backup of current data"""
    try:
        file_manager.create_backup(file_manager.dex_file)
        file_manager.create_backup(file_manager.cex_file)
        return {"message": "Backup created successfully", "timestamp": datetime.now().isoformat()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create backup: {str(e)}")