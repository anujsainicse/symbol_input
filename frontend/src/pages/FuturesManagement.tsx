import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Plus, Edit2, Trash2, RefreshCw, Eye } from 'lucide-react';
import { futuresApi, filesApi } from '../services/api';
import { FuturesSymbol, FuturesSymbolRequest } from '../types/symbols';

const FuturesManagement: React.FC = () => {
  const [editingSymbol, setEditingSymbol] = useState<FuturesSymbol | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  
  const queryClient = useQueryClient();
  
  const { data: rawSymbols = [], isLoading } = useQuery({
    queryKey: ['futuresSymbols'],
    queryFn: futuresApi.getSymbols,
  });

  const symbols = rawSymbols.sort((a, b) => a.symbol.localeCompare(b.symbol));

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FuturesSymbolRequest>();

  const addMutation = useMutation({
    mutationFn: futuresApi.addSymbol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['futuresSymbols'] });
      queryClient.invalidateQueries({ queryKey: ['fileStatus'] });
      reset();
    },
    onError: (error: any) => {
      console.error('Error adding futures symbol:', error);
      alert(`Error adding symbol: ${error.response?.data?.detail || error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FuturesSymbolRequest }) => 
      futuresApi.updateSymbol(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['futuresSymbols'] });
      queryClient.invalidateQueries({ queryKey: ['fileStatus'] });
      setEditingSymbol(null);
      reset();
    },
    onError: (error: any) => {
      console.error('Error updating futures symbol:', error);
      alert(`Error updating symbol: ${error.response?.data?.detail || error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: futuresApi.deleteSymbol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['futuresSymbols'] });
      queryClient.invalidateQueries({ queryKey: ['fileStatus'] });
    },
    onError: (error: any) => {
      console.error('Error deleting futures symbol:', error);
      alert(`Error deleting symbol: ${error.response?.data?.detail || error.message}`);
    },
  });

  const regenerateMutation = useMutation({
    mutationFn: futuresApi.regenerateFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fileStatus'] });
    },
    onError: (error: any) => {
      console.error('Error regenerating futures file:', error);
      alert(`Error regenerating file: ${error.response?.data?.detail || error.message}`);
    },
  });

  const previewMutation = useMutation({
    mutationFn: () => filesApi.getFileContent('futures_symbols'),
    onSuccess: (data) => {
      setPreviewContent(data.content);
      setShowPreview(true);
    },
    onError: (error: any) => {
      console.error('Error previewing file:', error);
      alert(`Error loading file preview: ${error.response?.data?.detail || error.message}`);
    },
  });

  const onSubmit = (data: FuturesSymbolRequest) => {
    if (editingSymbol) {
      updateMutation.mutate({ id: editingSymbol.id, data });
    } else {
      addMutation.mutate(data);
    }
  };

  const handleEdit = (symbol: FuturesSymbol) => {
    setEditingSymbol(symbol);
    reset({
      symbol: symbol.symbol,
      ticker: symbol.ticker,
      exchange: symbol.exchange,
    });
  };

  const handleCancelEdit = () => {
    setEditingSymbol(null);
    reset();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this symbol?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Futures Symbols Management</h1>
              <p className="text-gray-300">Manage cryptocurrency futures trading symbols</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => previewMutation.mutate()}
                className="btn-secondary inline-flex items-center justify-center"
                disabled={previewMutation.isPending}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview File
              </button>
              <button
                onClick={() => regenerateMutation.mutate()}
                className="btn-purple inline-flex items-center justify-center"
                disabled={regenerateMutation.isPending}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate File
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        <div className="card-modern mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {editingSymbol ? 'Edit Futures Symbol' : 'Add New Futures Symbol'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Symbol
              </label>
              <input
                type="text"
                {...register('symbol', { 
                  required: 'Symbol is required',
                  pattern: {
                    value: /^[A-Za-z]{2,10}$/,
                    message: 'Symbol must be 2-10 letters'
                  }
                })}
                className="input-modern"
                placeholder="BTC, ETH, SOL..."
              />
              {errors.symbol && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                  {errors.symbol.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Ticker
              </label>
              <input
                type="text"
                {...register('ticker', { 
                  required: 'Ticker is required'
                })}
                className="input-modern"
                placeholder="BTCUSDT, ETHUSDT..."
              />
              {errors.ticker && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                  {errors.ticker.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Exchange
              </label>
              <select
                {...register('exchange', { required: 'Exchange is required' })}
                className="select-modern"
              >
                <option value="" className="bg-gray-800">Select a futures exchange</option>
                <option value="binance" className="bg-gray-800">Binance Futures</option>
                <option value="bybit" className="bg-gray-800">Bybit</option>
                <option value="okx" className="bg-gray-800">OKX</option>
                <option value="bitget" className="bg-gray-800">Bitget</option>
                <option value="bitmex" className="bg-gray-800">BitMEX</option>
                <option value="deribit" className="bg-gray-800">Deribit</option>
                <option value="kraken" className="bg-gray-800">Kraken Futures</option>
                <option value="huobi" className="bg-gray-800">Huobi Futures</option>
                <option value="gate" className="bg-gray-800">Gate.io Futures</option>
                <option value="kucoin" className="bg-gray-800">KuCoin Futures</option>
              </select>
              {errors.exchange && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                  {errors.exchange.message}
                </p>
              )}
            </div>

            <div className="md:col-span-3 flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className="btn-purple inline-flex items-center justify-center"
                disabled={addMutation.isPending || updateMutation.isPending}
              >
                <Plus className="w-4 h-4 mr-2" />
                {editingSymbol ? 'Update Symbol' : 'Add Symbol'}
              </button>
              
              {editingSymbol && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Symbols Table */}
        <div className="card-modern overflow-hidden">
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{symbols.length}</span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                Futures Symbols
              </h2>
            </div>
            <div className="badge-info">
              {symbols.length} Active
            </div>
          </div>
          
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-gray-300 font-medium">Loading symbols...</p>
              <p className="text-gray-400 text-sm mt-1">Fetching data from server</p>
            </div>
          ) : symbols.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-300 font-medium mb-2">No futures symbols found</p>
              <p className="text-gray-400 text-sm">Add your first symbol using the form above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th className="table-header">
                      Symbol
                    </th>
                    <th className="table-header">
                      Ticker
                    </th>
                    <th className="table-header">
                      Exchange
                    </th>
                    <th className="table-header">
                      Created
                    </th>
                    <th className="table-header">
                      Updated
                    </th>
                    <th className="table-header">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {symbols.map((symbol, index) => (
                    <tr key={symbol.id} className={`table-row ${index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-900/30'}`}>
                      <td className="table-cell">
                        <span className="inline-flex items-center px-3 py-1 text-sm font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                          {symbol.symbol}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="text-cyan-400 font-medium">{symbol.ticker}</span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                          <span className="text-white font-medium capitalize">{symbol.exchange}</span>
                        </div>
                      </td>
                      <td className="table-cell text-gray-400">
                        {new Date(symbol.created_at).toLocaleDateString()}
                      </td>
                      <td className="table-cell text-gray-400">
                        {new Date(symbol.updated_at).toLocaleDateString()}
                      </td>
                      <td className="table-cell">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(symbol)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-all"
                            title="Edit symbol"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(symbol.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all"
                            disabled={deleteMutation.isPending}
                            title="Delete symbol"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-3xl w-full max-h-96 overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-gradient-to-r from-gray-800 to-gray-700">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">futures_symbols.txt Preview</h3>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg flex items-center justify-center transition-all"
                >
                  ×
                </button>
              </div>
              <div className="p-6 overflow-auto max-h-80 bg-gray-900">
                <pre className="text-sm text-purple-400 whitespace-pre-wrap font-mono bg-gray-800 p-4 rounded-lg border border-gray-700">
                  {previewContent || 'Empty file'}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FuturesManagement;