import React, { useState } from 'react';
import { useChannels } from '../../hooks/useChannels';
import StatusBadge from '../../components/StatusBadge'; 
import { AddChannelModal } from '../../components/AddChannelModal';
import { ChannelDetailModal } from '../../components/ChannelDetailModal'; 
import { unsubscribeFromChannel } from '../../services/youtubeApiService';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  UsersIcon,
  VideoCameraIcon,
  XCircleIcon,
  TrashIcon // Thêm icon thùng rác
} from '@heroicons/react/24/outline'; 

export const ChannelManagementPage = () => {
  const { channels, isLoading, error, handleUnsubscribe, getChannels } = useChannels();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOptimisticUnsubscribe = async (channelId: string) => {
    handleUnsubscribe(channelId);
    try {
      await unsubscribeFromChannel(channelId);
    } catch (err) {
      console.error("Lỗi khi ngừng theo dõi:", err);
    }
  };
  
  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const handleOpenDetailModal = (channelId: string) => {
    setSelectedChannelId(channelId);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedChannelId(null);
    setIsDetailModalOpen(false);
  };

  const filteredChannels = channels?.filter(channel => 
    channel.channelName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="p-8 mt-6 text-center text-white text-lg font-medium">Đang tải danh sách kênh...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-lg font-medium text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 sm:p-8 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-white">Quản lý Kênh Theo Dõi</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm kênh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          <button
            onClick={handleOpenAddModal}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2 transition-colors duration-200"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Thêm Kênh</span>
          </button>
        </div>
      </div>
      
      {/* --- Desktop View --- */}
      <div className="hidden md:block bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Tên Kênh</th>
              <th className="py-3 px-6 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">Người Theo Dõi</th>
              <th className="py-3 px-6 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">Tổng Video</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Trạng thái</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {filteredChannels?.map((channel) => (
              <tr key={channel.id} className="hover:bg-gray-700/50 transition duration-150 ease-in-out">
                <td 
                  className="py-4 px-6 whitespace-nowrap text-base font-medium text-blue-400 hover:underline cursor-pointer"
                  onClick={() => handleOpenDetailModal(channel.channelId)}
                >
                  {channel.channelName}
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-center text-base text-gray-300">
                  <div className="flex items-center justify-center space-x-2">
                    <UsersIcon className="h-5 w-5 text-green-400" />
                    <span>{channel.subscriberCount?.toLocaleString() || 'N/A'}</span>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-center text-base text-gray-300">
                  <div className="flex items-center justify-center space-x-2">
                    <VideoCameraIcon className="h-5 w-5 text-yellow-400" />
                    <span>{channel.videoCount?.toLocaleString() || 'N/A'}</span>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-base">
                  <StatusBadge status={channel.active ? 'Đang theo dõi' : 'Đã dừng'} />
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-base space-x-2">
                  {channel.active ? (
                    <button
                      className="text-white px-3 py-1 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 transition-colors duration-200"
                      onClick={() => handleOptimisticUnsubscribe(channel.channelId)}
                    >
                      <TrashIcon className="h-4 w-4 mr-1 inline-block" /> Ngừng theo dõi
                    </button>
                  ) : (
                    <span className="text-gray-500 font-medium">Đã ngừng</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Mobile View (Card-based) --- */}
      <div className="md:hidden space-y-4">
        {filteredChannels?.map((channel) => (
          <div key={channel.id} className="bg-gray-800 rounded-lg shadow-lg p-5 border border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between">
              <div className="flex-grow">
                <p 
                  className="text-lg font-semibold text-blue-400 hover:underline cursor-pointer"
                  onClick={() => handleOpenDetailModal(channel.channelId)}
                >
                  {channel.channelName}
                </p>
                <div className="mt-2 space-y-2 text-gray-300">
                  <div className="flex items-center space-x-2">
                    <UsersIcon className="h-5 w-5 text-green-400" />
                    <span>{channel.subscriberCount?.toLocaleString() || 'N/A'} người đăng ký</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <VideoCameraIcon className="h-5 w-5 text-yellow-400" />
                    <span>{channel.videoCount?.toLocaleString() || 'N/A'} video</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                <StatusBadge status={channel.active ? 'Đang theo dõi' : 'Đã dừng'} />
              </div>
            </div>
            <div className="mt-4">
              {channel.active ? (
                <button
                  className="w-full flex items-center justify-center px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 font-medium transition-colors duration-200"
                  onClick={() => handleOptimisticUnsubscribe(channel.channelId)}
                >
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Ngừng theo dõi
                </button>
              ) : (
                <span className="w-full flex items-center justify-center py-2 text-gray-500 font-medium">
                  Đã ngừng theo dõi
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <AddChannelModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSuccess={() => getChannels()} 
      />
      <ChannelDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        channelId={selectedChannelId}
      />
    </div>
  );
};