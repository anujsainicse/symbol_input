import json
import os
import shutil
from datetime import datetime
from typing import List
from pathlib import Path
import uuid

from app.models.symbols import DEXSymbol, CEXSymbol, DEXData, CEXData

class FileManager:
    def __init__(self, data_dir: str = "data"):
        self.data_dir = Path(data_dir)
        self.dex_file = self.data_dir / "dex_symbols.json"
        self.cex_file = self.data_dir / "cex_symbols.json"
        self.generated_dir = self.data_dir / "generated"
        self.backups_dir = self.data_dir / "backups"
        # Save txt files to current directory instead of generated folder
        self.pooladdress_file = Path("pooladdress.txt")
        self.cex_symbols_file = Path("cex_symbols.txt")
        
        self.initialize_directories()
    
    def initialize_directories(self):
        """Create necessary directories and files if they don't exist"""
        self.data_dir.mkdir(exist_ok=True)
        self.generated_dir.mkdir(exist_ok=True)
        self.backups_dir.mkdir(exist_ok=True)
        
        # Initialize empty JSON files if they don't exist
        if not self.dex_file.exists():
            self.write_dex_data(DEXData(symbols=[], last_updated=datetime.now().isoformat(), version=1))
        
        if not self.cex_file.exists():
            self.write_cex_data(CEXData(symbols=[], last_updated=datetime.now().isoformat(), version=1))
        
        # Generate txt files from existing JSON data on startup
        self.sync_txt_files()
    
    def create_backup(self, file_path: Path):
        """Create a backup of the specified file"""
        if file_path.exists():
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_name = f"{file_path.stem}_{timestamp}.json"
            backup_path = self.backups_dir / backup_name
            shutil.copy2(file_path, backup_path)
            
            # Keep only last 10 backups
            backups = sorted(self.backups_dir.glob(f"{file_path.stem}_*.json"))
            if len(backups) > 10:
                for old_backup in backups[:-10]:
                    old_backup.unlink()
    
    def read_dex_data(self) -> DEXData:
        """Read DEX symbols from JSON file"""
        try:
            with open(self.dex_file, 'r') as f:
                data = json.load(f)
                return DEXData(**data)
        except (FileNotFoundError, json.JSONDecodeError):
            return DEXData(symbols=[], last_updated=datetime.now().isoformat(), version=1)
    
    def write_dex_data(self, data: DEXData):
        """Write DEX symbols to JSON file and generate txt file"""
        self.create_backup(self.dex_file)
        
        data.last_updated = datetime.now().isoformat()
        data.version += 1
        
        with open(self.dex_file, 'w') as f:
            json.dump(data.dict(), f, indent=2)
        
        self.generate_dex_file(data.symbols)
    
    def read_cex_data(self) -> CEXData:
        """Read CEX symbols from JSON file"""
        try:
            with open(self.cex_file, 'r') as f:
                data = json.load(f)
                # Migrate existing symbols that don't have the symbol field
                for symbol_data in data.get('symbols', []):
                    if 'symbol' not in symbol_data:
                        # Use ticker_name as default symbol for backward compatibility
                        symbol_data['symbol'] = symbol_data.get('ticker_name', '')
                return CEXData(**data)
        except (FileNotFoundError, json.JSONDecodeError):
            return CEXData(symbols=[], last_updated=datetime.now().isoformat(), version=1)
    
    def write_cex_data(self, data: CEXData):
        """Write CEX symbols to JSON file and generate txt file"""
        self.create_backup(self.cex_file)
        
        data.last_updated = datetime.now().isoformat()
        data.version += 1
        
        with open(self.cex_file, 'w') as f:
            json.dump(data.dict(), f, indent=2)
        
        self.generate_cex_file(data.symbols)
    
    def generate_dex_file(self, symbols: List[DEXSymbol]):
        """Generate pooladdress.txt file"""
        content = [
            "# Pool addresses for different DEXes",
            "# Format: dex_type:pool_address:pool_name:altcoin_quantity", 
            "# Supported dex_types: uniswap_v2, uniswap_v3, sushiswap_v2, sushiswap_v3",
            "# altcoin_quantity: How many altcoins you want to exchange for WETH",
            "",
            "# Working pools (add your desired altcoin quantities)"
        ]
        
        for symbol in symbols:
            line = f"{symbol.dex_type}:{symbol.pool_address}:{symbol.pool_name}:{symbol.altcoin_quantity}"
            content.append(line)
        
        with open(self.pooladdress_file, 'w') as f:
            f.write('\n'.join(content))
    
    def generate_cex_file(self, symbols: List[CEXSymbol]):
        """Generate cex_symbols.txt file"""
        lines = []
        for symbol in symbols:
            # Use ticker_name as fallback if symbol is None (for backward compatibility)
            symbol_value = symbol.symbol if symbol.symbol is not None else symbol.ticker_name
            line = f"{symbol.ticker_name}:{symbol.exchange_name}:{symbol_value}"
            lines.append(line)
        
        with open(self.cex_symbols_file, 'w') as f:
            f.write('\n'.join(lines))
    
    def get_file_size(self, file_path: Path) -> int:
        """Get file size in bytes"""
        try:
            return file_path.stat().st_size
        except FileNotFoundError:
            return 0
    
    def sync_txt_files(self):
        """Generate txt files from current JSON data"""
        dex_data = self.read_dex_data()
        cex_data = self.read_cex_data()
        self.generate_dex_file(dex_data.symbols)
        self.generate_cex_file(cex_data.symbols)
    
    def add_dex_symbol(self, symbol_data: dict) -> DEXSymbol:
        """Add a new DEX symbol"""
        data = self.read_dex_data()
        
        # Check for duplicates
        for existing in data.symbols:
            if existing.pool_address.lower() == symbol_data['pool_address'].lower():
                raise ValueError(f"Pool address {symbol_data['pool_address']} already exists")
        
        new_symbol = DEXSymbol(
            id=str(uuid.uuid4()),
            created_at=datetime.now().isoformat(),
            updated_at=datetime.now().isoformat(),
            **symbol_data
        )
        
        data.symbols.append(new_symbol)
        self.write_dex_data(data)
        return new_symbol
    
    def update_dex_symbol(self, symbol_id: str, symbol_data: dict) -> DEXSymbol:
        """Update an existing DEX symbol"""
        data = self.read_dex_data()
        
        for i, symbol in enumerate(data.symbols):
            if symbol.id == symbol_id:
                updated_symbol = DEXSymbol(
                    id=symbol_id,
                    created_at=symbol.created_at,
                    updated_at=datetime.now().isoformat(),
                    **symbol_data
                )
                data.symbols[i] = updated_symbol
                self.write_dex_data(data)
                return updated_symbol
        
        raise ValueError(f"DEX symbol with id {symbol_id} not found")
    
    def delete_dex_symbol(self, symbol_id: str):
        """Delete a DEX symbol"""
        data = self.read_dex_data()
        
        for i, symbol in enumerate(data.symbols):
            if symbol.id == symbol_id:
                data.symbols.pop(i)
                self.write_dex_data(data)
                return
        
        raise ValueError(f"DEX symbol with id {symbol_id} not found")
    
    def add_cex_symbol(self, symbol_data: dict) -> CEXSymbol:
        """Add a new CEX symbol"""
        data = self.read_cex_data()
        
        # Check for duplicates
        for existing in data.symbols:
            if (existing.ticker_name == symbol_data['ticker_name'].upper() and 
                existing.exchange_name.lower() == symbol_data['exchange_name'].lower()):
                raise ValueError(f"Symbol {symbol_data['ticker_name']} on {symbol_data['exchange_name']} already exists")
        
        new_symbol = CEXSymbol(
            id=str(uuid.uuid4()),
            created_at=datetime.now().isoformat(),
            updated_at=datetime.now().isoformat(),
            **symbol_data
        )
        
        data.symbols.append(new_symbol)
        self.write_cex_data(data)
        return new_symbol
    
    def update_cex_symbol(self, symbol_id: str, symbol_data: dict) -> CEXSymbol:
        """Update an existing CEX symbol"""
        data = self.read_cex_data()
        
        for i, symbol in enumerate(data.symbols):
            if symbol.id == symbol_id:
                updated_symbol = CEXSymbol(
                    id=symbol_id,
                    created_at=symbol.created_at,
                    updated_at=datetime.now().isoformat(),
                    **symbol_data
                )
                data.symbols[i] = updated_symbol
                self.write_cex_data(data)
                return updated_symbol
        
        raise ValueError(f"CEX symbol with id {symbol_id} not found")
    
    def delete_cex_symbol(self, symbol_id: str):
        """Delete a CEX symbol"""
        data = self.read_cex_data()
        
        for i, symbol in enumerate(data.symbols):
            if symbol.id == symbol_id:
                data.symbols.pop(i)
                self.write_cex_data(data)
                return
        
        raise ValueError(f"CEX symbol with id {symbol_id} not found")