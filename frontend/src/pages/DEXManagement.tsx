import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Plus, Edit2, Trash2, RefreshCw, Eye } from 'lucide-react';
import { dexApi, filesApi } from '../services/api';
import { DEXSymbol, DEXSymbolRequest } from '../types/symbols';

const DEXManagement: React.FC = () => {
  const [editingSymbol, setEditingSymbol] = useState<DEXSymbol | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  
  const queryClient = useQueryClient();
  
  const { data: rawSymbols = [], isLoading } = useQuery({
    queryKey: ['dexSymbols'],
    queryFn: dexApi.getSymbols,
  });

  const symbols = rawSymbols.sort((a, b) => a.pool_name.localeCompare(b.pool_name));

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DEXSymbolRequest>();

  const addMutation = useMutation({
    mutationFn: dexApi.addSymbol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dexSymbols'] });
      queryClient.invalidateQueries({ queryKey: ['fileStatus'] });
      reset();
    },
    onError: (error: any) => {
      console.error('Error adding DEX symbol:', error);
      alert(`Error adding symbol: ${error.response?.data?.detail || error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: DEXSymbolRequest }) => 
      dexApi.updateSymbol(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dexSymbols'] });
      queryClient.invalidateQueries({ queryKey: ['fileStatus'] });
      setEditingSymbol(null);
      reset();
    },
    onError: (error: any) => {
      console.error('Error updating DEX symbol:', error);
      alert(`Error updating symbol: ${error.response?.data?.detail || error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: dexApi.deleteSymbol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dexSymbols'] });
      queryClient.invalidateQueries({ queryKey: ['fileStatus'] });
    },
    onError: (error: any) => {
      console.error('Error deleting DEX symbol:', error);
      alert(`Error deleting symbol: ${error.response?.data?.detail || error.message}`);
    },
  });

  const regenerateMutation = useMutation({
    mutationFn: dexApi.regenerateFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fileStatus'] });
    },
    onError: (error: any) => {
      console.error('Error regenerating DEX file:', error);
      alert(`Error regenerating file: ${error.response?.data?.detail || error.message}`);
    },
  });

  const previewMutation = useMutation({
    mutationFn: () => filesApi.getFileContent('pooladdress'),
    onSuccess: (data) => {
      setPreviewContent(data.content);
      setShowPreview(true);
    },
    onError: (error: any) => {
      console.error('Error previewing file:', error);
      alert(`Error loading file preview: ${error.response?.data?.detail || error.message}`);
    },
  });

  const onSubmit = (data: DEXSymbolRequest) => {
    if (editingSymbol) {
      updateMutation.mutate({ id: editingSymbol.id, data });
    } else {
      addMutation.mutate(data);
    }
  };

  const handleEdit = (symbol: DEXSymbol) => {
    setEditingSymbol(symbol);
    reset({
      dex_type: symbol.dex_type,
      pool_address: symbol.pool_address,
      pool_name: symbol.pool_name,
      altcoin_quantity: symbol.altcoin_quantity,
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
      <div className="max-w-7xl mx-auto px-6">
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
              <h1 className="text-4xl font-bold gradient-text mb-2">DEX Symbols Management</h1>
              <p className="text-gray-300">Manage decentralized exchange pool addresses</p>
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
                className="btn-primary inline-flex items-center justify-center"
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
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {editingSymbol ? 'Edit DEX Symbol' : 'Add New DEX Symbol'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                DEX Type
              </label>
              <select
                {...register('dex_type', { required: 'DEX type is required' })}
                className="select-modern"
              >
                <option value="" className="bg-gray-800">Select DEX Type</option>
                <option value="uniswap_v2" className="bg-gray-800">Uniswap V2</option>
                <option value="uniswap_v3" className="bg-gray-800">Uniswap V3</option>
                <option value="sushiswap_v2" className="bg-gray-800">SushiSwap V2</option>
                <option value="sushiswap_v3" className="bg-gray-800">SushiSwap V3</option>
              </select>
              {errors.dex_type && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                  {errors.dex_type.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Pool Address
              </label>
              <input
                type="text"
                {...register('pool_address', { 
                  required: 'Pool address is required',
                  pattern: {
                    value: /^0x[a-fA-F0-9]{40}$/,
                    message: 'Invalid Ethereum address'
                  }
                })}
                className="input-modern font-mono text-sm"
                placeholder="0x1234...abcd"
              />
              {errors.pool_address && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                  {errors.pool_address.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Pool Name
              </label>
              <input
                type="text"
                {...register('pool_name', { required: 'Pool name is required' })}
                className="input-modern"
                placeholder="COTI, SHIB, etc."
              />
              {errors.pool_name && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                  {errors.pool_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Altcoin Quantity
              </label>
              <input
                type="number"
                {...register('altcoin_quantity', { 
                  required: 'Altcoin quantity is required',
                  min: { value: 1, message: 'Quantity must be positive' }
                })}
                className="input-modern"
                placeholder="10000"
              />
              {errors.altcoin_quantity && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                  {errors.altcoin_quantity.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2 lg:col-span-4 flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className="btn-primary inline-flex items-center justify-center"
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
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{symbols.length}</span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                DEX Symbols
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
              <p className="text-gray-400 text-sm mt-1">Fetching pool data</p>
            </div>
          ) : symbols.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-300 font-medium mb-2">No DEX symbols found</p>
              <p className="text-gray-400 text-sm">Add your first pool address using the form above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th className="table-header">
                      DEX Type
                    </th>
                    <th className="table-header">
                      Pool Address
                    </th>
                    <th className="table-header">
                      Pool Name
                    </th>
                    <th className="table-header">
                      Quantity
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
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${
                          symbol.dex_type.includes('uniswap') 
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        }`}>
                          {symbol.dex_type.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center">
                          <code className="text-blue-400 font-mono text-sm bg-gray-700/50 px-2 py-1 rounded">
                            {symbol.pool_address.slice(0, 6)}...{symbol.pool_address.slice(-4)}
                          </code>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                          <span className="text-white font-medium">{symbol.pool_name}</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="text-yellow-400 font-bold">
                          {symbol.altcoin_quantity.toLocaleString()}
                        </span>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-96 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold">pooladdress.txt Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="p-6 overflow-auto max-h-80">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {previewContent}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DEXManagement;