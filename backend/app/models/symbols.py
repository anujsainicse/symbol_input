from pydantic import BaseModel, validator
from typing import List, Optional
from datetime import datetime
import re

class DEXSymbol(BaseModel):
    id: str
    dex_type: str
    pool_address: str
    pool_name: str
    altcoin_quantity: int
    created_at: str
    updated_at: str
    
    @validator('dex_type')
    def validate_dex_type(cls, v):
        allowed_types = ['uniswap_v2', 'uniswap_v3', 'sushiswap_v2', 'sushiswap_v3']
        if v not in allowed_types:
            raise ValueError(f'dex_type must be one of {allowed_types}')
        return v
    
    @validator('pool_address')
    def validate_pool_address(cls, v):
        if not re.match(r'^0x[a-fA-F0-9]{40}$', v):
            raise ValueError('pool_address must be a valid Ethereum address')
        return v
    
    @validator('pool_name')
    def validate_pool_name(cls, v):
        return v.upper()
    
    @validator('altcoin_quantity')
    def validate_altcoin_quantity(cls, v):
        if v <= 0:
            raise ValueError('altcoin_quantity must be positive')
        return v

class CEXSymbol(BaseModel):
    id: str
    ticker_name: str
    exchange_name: str
    symbol: Optional[str] = None
    created_at: str
    updated_at: str
    
    @validator('ticker_name')
    def validate_ticker_name(cls, v):
        v_upper = v.upper()
        if not re.match(r'^[A-Z]{2,10}$', v_upper):
            raise ValueError('ticker_name must be 2-10 characters')
        return v_upper

class DEXSymbolRequest(BaseModel):
    dex_type: str
    pool_address: str
    pool_name: str
    altcoin_quantity: int

class CEXSymbolRequest(BaseModel):
    ticker_name: str
    exchange_name: str
    symbol: str

class DEXData(BaseModel):
    symbols: List[DEXSymbol]
    last_updated: str
    version: int

class CEXData(BaseModel):
    symbols: List[CEXSymbol]
    last_updated: str
    version: int

class FileStatus(BaseModel):
    dex_symbols_count: int
    cex_symbols_count: int
    dex_file_size: int
    cex_file_size: int
    last_updated: str
    pooladdress_file_exists: bool
    cex_symbols_file_exists: bool