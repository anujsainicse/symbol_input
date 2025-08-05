import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Download, Database, Clock, TrendingUp, BarChart3, Activity, Zap } from 'lucide-react';
import { filesApi } from '../services/api';

const Landing: React.FC = () => {
  const { data: fileStatus, isLoading } = useQuery({
    queryKey: ['fileStatus'],
    queryFn: filesApi.getStatus,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold gradient-text mb-6">
            Crypto Symbols Manager
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Professional cryptocurrency symbol management with automated file generation for price fetching and trading systems
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          <Link
            to="/dex"
            className="card-glass group text-center cursor-pointer"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Database className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              DEX Symbols
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Configure Uniswap, SushiSwap, and other decentralized exchange pool addresses with automated liquidity tracking
            </p>
            <div className="flex items-center justify-center space-x-2 text-blue-400">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-medium">Manage Pool Addresses</span>
            </div>
          </Link>

          <Link
            to="/cex"
            className="card-glass group text-center cursor-pointer"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              CEX Symbols
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Configure centralized exchange ticker symbols for major platforms like Binance, KuCoin, and more
            </p>
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Manage Exchange Symbols</span>
            </div>
          </Link>

          <Link
            to="/futures"
            className="card-glass group text-center cursor-pointer"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Futures Symbols
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Configure futures trading symbols across major derivatives exchanges like Binance, Bybit, OKX and more
            </p>
            <div className="flex items-center justify-center space-x-2 text-purple-400">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-medium">Manage Futures Symbols</span>
            </div>
          </Link>
        </div>

        {/* Status Dashboard */}
        {!isLoading && fileStatus && (
          <div className="card-modern mb-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold text-white">
                System Overview
              </h3>
              <div className="badge-success">
                <Activity className="w-4 h-4 inline mr-2" />
                Live Status
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border border-blue-500/30 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  {fileStatus.dex_symbols_count}
                </div>
                <div className="text-gray-300 font-medium">DEX Symbols</div>
                <div className="text-xs text-blue-300 mt-1">Decentralized Pools</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-600/20 to-green-700/20 border border-green-500/30 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {fileStatus.cex_symbols_count}
                </div>
                <div className="text-gray-300 font-medium">CEX Symbols</div>
                <div className="text-xs text-green-300 mt-1">Exchange Tickers</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 border border-purple-500/30 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">
                  {fileStatus.futures_symbols_count || 0}
                </div>
                <div className="text-gray-300 font-medium">Futures Symbols</div>
                <div className="text-xs text-purple-300 mt-1">Derivatives Trading</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-700/20 border border-indigo-500/30 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-indigo-400 mb-2">
                  {formatFileSize(fileStatus.dex_file_size)}
                </div>
                <div className="text-gray-300 font-medium">DEX File</div>
                <div className="text-xs text-indigo-300 mt-1">pooladdress.txt</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-600/20 to-orange-700/20 border border-orange-500/30 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">
                  {formatFileSize(fileStatus.cex_file_size)}
                </div>
                <div className="text-gray-300 font-medium">CEX File</div>
                <div className="text-xs text-orange-300 mt-1">cex_symbols.txt</div>
              </div>
              
              <div className="bg-gradient-to-br from-pink-600/20 to-pink-700/20 border border-pink-500/30 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-pink-400 mb-2">
                  {formatFileSize(fileStatus.futures_file_size || 0)}
                </div>
                <div className="text-gray-300 font-medium">Futures File</div>
                <div className="text-xs text-pink-300 mt-1">futures_symbols.txt</div>
              </div>
            </div>

            <div className="flex items-center justify-center text-gray-400 mb-8 bg-gray-800/50 rounded-lg py-3">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-medium">Last updated: {formatDate(fileStatus.last_updated)}</span>
            </div>

            {/* Download Section */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-6">
              <h4 className="text-xl font-semibold text-white mb-4 text-center">Download Generated Files</h4>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {fileStatus.pooladdress_file_exists && (
                  <a
                    href={filesApi.downloadFile('pooladdress')}
                    className="btn-primary inline-flex items-center justify-center"
                    download
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download pooladdress.txt
                  </a>
                )}
                
                {fileStatus.cex_symbols_file_exists && (
                  <a
                    href={filesApi.downloadFile('cex_symbols')}
                    className="btn-success inline-flex items-center justify-center"
                    download
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download cex_symbols.txt
                  </a>
                )}
                
                {fileStatus.futures_symbols_file_exists && (
                  <a
                    href={filesApi.downloadFile('futures_symbols')}
                    className="btn-purple inline-flex items-center justify-center"
                    download
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download futures_symbols.txt
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="card-modern text-center max-w-md mx-auto">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-300 font-medium">Loading system status...</p>
            <p className="text-gray-400 text-sm mt-2">Fetching real-time data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;