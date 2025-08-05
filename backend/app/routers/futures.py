from fastapi import APIRouter, HTTPException
from typing import List
import uuid
from datetime import datetime

from app.models.symbols import FuturesSymbol, FuturesSymbolRequest, FuturesData
from app.utils.file_manager import FileManager

router = APIRouter(prefix="/api/futures", tags=["futures"])
file_manager = FileManager()

@router.get("/symbols", response_model=List[FuturesSymbol])
async def get_futures_symbols():
    """Get all futures symbols"""
    try:
        data = file_manager.read_futures_data()
        return data.symbols
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/symbols", response_model=FuturesSymbol)
async def add_futures_symbol(symbol: FuturesSymbolRequest):
    """Add a new futures symbol"""
    try:
        # Create backup before modifying
        file_manager.create_backup('futures')
        
        # Read current data
        data = file_manager.read_futures_data()
        
        # Create new symbol
        new_symbol = FuturesSymbol(
            id=str(uuid.uuid4()),
            symbol=symbol.symbol,
            ticker=symbol.ticker,
            exchange=symbol.exchange,
            created_at=datetime.now().isoformat(),
            updated_at=datetime.now().isoformat()
        )
        
        # Add to data
        data.symbols.append(new_symbol)
        data.last_updated = datetime.now().isoformat()
        data.version += 1
        
        # Save data
        file_manager.write_futures_data(data)
        
        # Generate futures file
        file_manager.generate_futures_file(data.symbols)
        
        return new_symbol
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/symbols/{symbol_id}", response_model=FuturesSymbol)
async def update_futures_symbol(symbol_id: str, symbol: FuturesSymbolRequest):
    """Update an existing futures symbol"""
    try:
        # Create backup before modifying
        file_manager.create_backup('futures')
        
        # Read current data
        data = file_manager.read_futures_data()
        
        # Find and update symbol
        for i, s in enumerate(data.symbols):
            if s.id == symbol_id:
                updated_symbol = FuturesSymbol(
                    id=symbol_id,
                    symbol=symbol.symbol,
                    ticker=symbol.ticker,
                    exchange=symbol.exchange,
                    created_at=s.created_at,
                    updated_at=datetime.now().isoformat()
                )
                data.symbols[i] = updated_symbol
                data.last_updated = datetime.now().isoformat()
                data.version += 1
                
                # Save data
                file_manager.write_futures_data(data)
                
                # Generate futures file
                file_manager.generate_futures_file(data.symbols)
                
                return updated_symbol
        
        raise HTTPException(status_code=404, detail="Symbol not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/symbols/{symbol_id}")
async def delete_futures_symbol(symbol_id: str):
    """Delete a futures symbol"""
    try:
        # Create backup before modifying
        file_manager.create_backup('futures')
        
        # Read current data
        data = file_manager.read_futures_data()
        
        # Remove symbol
        data.symbols = [s for s in data.symbols if s.id != symbol_id]
        data.last_updated = datetime.now().isoformat()
        data.version += 1
        
        # Save data
        file_manager.write_futures_data(data)
        
        # Generate futures file
        file_manager.generate_futures_file(data.symbols)
        
        return {"message": "Symbol deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-file")
async def regenerate_futures_file():
    """Regenerate the futures_symbols.txt file"""
    try:
        data = file_manager.read_futures_data()
        file_manager.generate_futures_file(data.symbols)
        return {"message": "Futures file regenerated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))