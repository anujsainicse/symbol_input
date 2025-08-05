import axios from 'axios';
import { DEXSymbol, CEXSymbol, FuturesSymbol, DEXSymbolRequest, CEXSymbolRequest, FuturesSymbolRequest, FileStatus } from '../types/symbols';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8003';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const dexApi = {
  getSymbols: (): Promise<DEXSymbol[]> => 
    api.get('/api/dex/symbols').then(res => res.data),
  
  addSymbol: (symbol: DEXSymbolRequest): Promise<DEXSymbol> => 
    api.post('/api/dex/symbols', symbol).then(res => res.data),
  
  updateSymbol: (id: string, symbol: DEXSymbolRequest): Promise<DEXSymbol> => 
    api.put(`/api/dex/symbols/${id}`, symbol).then(res => res.data),
  
  deleteSymbol: (id: string): Promise<void> => 
    api.delete(`/api/dex/symbols/${id}`).then(res => res.data),
  
  regenerateFile: (): Promise<void> => 
    api.post('/api/dex/generate-file').then(res => res.data),
};

export const cexApi = {
  getSymbols: (): Promise<CEXSymbol[]> => 
    api.get('/api/cex/symbols').then(res => res.data),
  
  addSymbol: (symbol: CEXSymbolRequest): Promise<CEXSymbol> => 
    api.post('/api/cex/symbols', symbol).then(res => res.data),
  
  updateSymbol: (id: string, symbol: CEXSymbolRequest): Promise<CEXSymbol> => 
    api.put(`/api/cex/symbols/${id}`, symbol).then(res => res.data),
  
  deleteSymbol: (id: string): Promise<void> => 
    api.delete(`/api/cex/symbols/${id}`).then(res => res.data),
  
  regenerateFile: (): Promise<void> => 
    api.post('/api/cex/generate-file').then(res => res.data),
};

export const futuresApi = {
  getSymbols: (): Promise<FuturesSymbol[]> => 
    api.get('/api/futures/symbols').then(res => res.data),
  
  addSymbol: (symbol: FuturesSymbolRequest): Promise<FuturesSymbol> => 
    api.post('/api/futures/symbols', symbol).then(res => res.data),
  
  updateSymbol: (id: string, symbol: FuturesSymbolRequest): Promise<FuturesSymbol> => 
    api.put(`/api/futures/symbols/${id}`, symbol).then(res => res.data),
  
  deleteSymbol: (id: string): Promise<void> => 
    api.delete(`/api/futures/symbols/${id}`).then(res => res.data),
  
  regenerateFile: (): Promise<void> => 
    api.post('/api/futures/generate-file').then(res => res.data),
};

export const filesApi = {
  getStatus: (): Promise<FileStatus> => 
    api.get('/api/files/status').then(res => res.data),
  
  downloadFile: (fileType: 'pooladdress' | 'cex_symbols' | 'futures_symbols'): string => 
    `${API_BASE_URL}/api/files/download/${fileType}`,
  
  getFileContent: (fileType: 'pooladdress' | 'cex_symbols' | 'futures_symbols'): Promise<{content: string}> => 
    api.get(`/api/files/content/${fileType}`).then(res => res.data),
  
  createBackup: (): Promise<{message: string, timestamp: string}> => 
    api.post('/api/files/backup/create').then(res => res.data),
};