import React, { useEffect, useState } from 'react';
import { fetchChannelById } from '../services/youtubeApiService';
import { Channel } from '../types/channel';
import StatusBadge from './StatusBadge';
import { toast } from 'react-toastify';

type ChannelDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  channelId: string | null;
};

export const ChannelDetailModal: React.FC<ChannelDetailModalProps> = ({ isOpen, onClose, channelId }) => {
  const [channelDetails, setChannelDetails] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && channelId) {
      setIsLoading(true);
      const getDetails = async () => {
        try {
          const data = await fetchChannelById(channelId);
          setChannelDetails(data);
        } catch (err) {
          console.error("Lỗi khi tải chi tiết kênh:", err);
          toast.error("Không thể tải chi tiết kênh.");
        } finally {
          setIsLoading(false);
        }
      };
      getDetails();
    }
  }, [isOpen, channelId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative transform scale-100 transition-transform duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {isLoading ? (
          <div className="text-center text-white text-lg py-10">Đang tải chi tiết...</div>
        ) : channelDetails ? (
          <div className="flex flex-col items-center text-center">
            {channelDetails.thumbnailUrl && (
              <img
                src={channelDetails.thumbnailUrl}
                alt={channelDetails.channelName}
                className="w-24 h-24 rounded-full border-4 border-gray-700 mb-4"
              />
            )}
            <h2 className="text-4xl font-extrabold text-white mb-2">{channelDetails.channelName}</h2>
            
            <div className="text-sm text-gray-400 mb-6">
              <span className="font-medium">ID:</span> {channelDetails.channelId}
            </div>

            <div className="w-full text-left space-y-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>
                  <span className="font-semibold text-white">Người đăng ký:</span> {channelDetails.subscriberCount?.toLocaleString() || 'N/A'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                <span>
                  <span className="font-semibold text-white">Tổng video:</span> {channelDetails.videoCount?.toLocaleString() || 'N/A'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  <span className="font-semibold text-white">Ngày theo dõi:</span> {channelDetails.subscribedAt ? new Date(channelDetails.subscribedAt).toLocaleDateString('vi-VN') : 'N/A'}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  <span className="font-semibold text-white">Cập nhật gần nhất:</span> {channelDetails.lastCheckedAt ? new Date(channelDetails.lastCheckedAt).toLocaleString('vi-VN') : 'N/A'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.048A12.01 12.01 0 003 9c0 5.591 3.824 10.29 9 11.696C17.176 19.29 21 14.591 21 9c0-1.03-.112-2.019-.33-2.972z" />
                </svg>
                <span className="font-semibold text-white">Trạng thái:</span> 
                <StatusBadge status={channelDetails.active ? 'Đang theo dõi' : 'Đã dừng'} />
              </div>
              
              <div className="pt-4">
                <p className="font-semibold text-white">Mô tả:</p>
                <p className="mt-2 text-gray-300 leading-relaxed italic">{channelDetails.description || 'Không có mô tả'}</p>
              </div>

            </div>
          </div>
        ) : (
          <div className="text-center text-white text-lg py-10">Không tìm thấy thông tin kênh.</div>
        )}
      </div>
    </div>
  );
};