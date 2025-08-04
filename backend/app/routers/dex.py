from fastapi import APIRouter, HTTPException
from typing import List

from app.models.symbols import DEXSymbol, DEXSymbolRequest
from app.utils.file_manager import FileManager

router = APIRouter(prefix="/api/dex", tags=["DEX"])
file_manager = FileManager()

@router.get("/symbols", response_model=List[DEXSymbol])
async def get_dex_symbols():
    """Get all DEX symbols"""
    data = file_manager.read_dex_data()
    return data.symbols

@router.post("/symbols", response_model=DEXSymbol)
async def add_dex_symbol(symbol: DEXSymbolRequest):
    """Add a new DEX symbol"""
    try:
        return file_manager.add_dex_symbol(symbol.dict())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/symbols/{symbol_id}", response_model=DEXSymbol)
async def update_dex_symbol(symbol_id: str, symbol: DEXSymbolRequest):
    """Update an existing DEX symbol"""
    try:
        return file_manager.update_dex_symbol(symbol_id, symbol.dict())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/symbols/{symbol_id}")
async def delete_dex_symbol(symbol_id: str):
    """Delete a DEX symbol"""
    try:
        file_manager.delete_dex_symbol(symbol_id)
        return {"message": "Symbol deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/generate-file")
async def regenerate_dex_file():
    """Force regenerate pooladdress.txt"""
    data = file_manager.read_dex_data()
    file_manager.generate_dex_file(data.symbols)
    return {"message": "DEX file regenerated successfully"}