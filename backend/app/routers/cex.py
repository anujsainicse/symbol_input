from fastapi import APIRouter, HTTPException
from typing import List

from app.models.symbols import CEXSymbol, CEXSymbolRequest
from app.utils.file_manager import FileManager

router = APIRouter(prefix="/api/cex", tags=["CEX"])
file_manager = FileManager()

@router.get("/symbols", response_model=List[CEXSymbol])
async def get_cex_symbols():
    """Get all CEX symbols"""
    data = file_manager.read_cex_data()
    return data.symbols

@router.post("/symbols", response_model=CEXSymbol)
async def add_cex_symbol(symbol: CEXSymbolRequest):
    """Add a new CEX symbol"""
    try:
        return file_manager.add_cex_symbol(symbol.dict())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/symbols/{symbol_id}", response_model=CEXSymbol)
async def update_cex_symbol(symbol_id: str, symbol: CEXSymbolRequest):
    """Update an existing CEX symbol"""
    try:
        return file_manager.update_cex_symbol(symbol_id, symbol.dict())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/symbols/{symbol_id}")
async def delete_cex_symbol(symbol_id: str):
    """Delete a CEX symbol"""
    try:
        file_manager.delete_cex_symbol(symbol_id)
        return {"message": "Symbol deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/generate-file")
async def regenerate_cex_file():
    """Force regenerate cex_symbols.txt"""
    data = file_manager.read_cex_data()
    file_manager.generate_cex_file(data.symbols)
    return {"message": "CEX file regenerated successfully"}