export interface DEXSymbol {
  id: string;
  dex_type: 'uniswap_v2' | 'uniswap_v3' | 'sushiswap_v2' | 'sushiswap_v3';
  pool_address: string;
  pool_name: string;
  altcoin_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CEXSymbol {
  id: string;
  ticker_name: string;
  exchange_name: string;
  symbol?: string;
  created_at: string;
  updated_at: string;
}

export interface DEXSymbolRequest {
  dex_type: string;
  pool_address: string;
  pool_name: string;
  altcoin_quantity: number;
}

export interface CEXSymbolRequest {
  ticker_name: string;
  exchange_name: string;
  symbol: string;
}

export interface FuturesSymbol {
  id: string;
  symbol: string;
  ticker: string;
  exchange: 'binance' | 'bybit' | 'okx' | 'bitget' | 'bitmex' | 'deribit' | 'kraken' | 'huobi' | 'gate' | 'kucoin';
  created_at: string;
  updated_at: string;
}

export interface FuturesSymbolRequest {
  symbol: string;
  ticker: string;
  exchange: string;
}

export interface FileStatus {
  dex_symbols_count: number;
  cex_symbols_count: number;
  futures_symbols_count: number;
  dex_file_size: number;
  cex_file_size: number;
  futures_file_size: number;
  last_updated: string;
  pooladdress_file_exists: boolean;
  cex_symbols_file_exists: boolean;
  futures_symbols_file_exists: boolean;
}