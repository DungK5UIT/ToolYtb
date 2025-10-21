import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { updateYoutubeApiKey } from '../services/youtubeApiService';
import { Cog6ToothIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const ApiKeyPage = () => {
    const [apiKey, setApiKey] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await updateYoutubeApiKey(apiKey, description);

            if (result.status === 'success') {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật YouTube API Key:", error);
            toast.error("Có lỗi xảy ra khi cập nhật API Key. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-8 mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-white">Quản lý API Keys</h1>
                <div className="relative w-full sm:w-64">
                    <Cog6ToothIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Quản lý key..."
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                    <Cog6ToothIcon className="h-6 w-6 text-red-500" />
                    <span>Cập nhật YouTube API Key</span>
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-1">
                            API Key mới
                        </label>
                        <input
                            type="text"
                            id="apiKey"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                            Mô tả
                        </label>
                        <input
                            type="text"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center space-x-2 transition-colors duration-200"
                        >
                            <ArrowPathIcon className="h-5 w-5" />
                            <span>{loading ? 'Đang cập nhật...' : 'Cập nhật Key'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApiKeyPage;