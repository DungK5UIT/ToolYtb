import React, { useState } from 'react';
import { subscribeToChannel } from '../services/youtubeApiService';
import { toast } from 'react-toastify'; 

type AddChannelModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export const AddChannelModal: React.FC<AddChannelModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [newChannel, setNewChannel] = useState({
    channelId: '',
    channelName: '',
    description: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewChannel(prev => ({ ...prev, [name]: value }));
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannel.channelId || !newChannel.channelName) {
      toast.error("Vui lòng nhập đầy đủ Channel ID và Tên kênh.");
      return;
    }
    
    try {
      await subscribeToChannel(newChannel);
      toast.success("Theo dõi kênh mới thành công!"); 
      setNewChannel({ channelId: '', channelName: '', description: '' }); 
      onSuccess(); 
      onClose();   
    } catch (err) {
      toast.error("Đã xảy ra lỗi khi theo dõi kênh."); 
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-xl p-8 relative transform scale-100 transition-transform duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-white mb-6">Thêm Kênh Mới</h2>
        <form onSubmit={handleSubscribe} className="space-y-6">
          <div>
            <label htmlFor="channelId" className="block text-base font-medium text-gray-400 mb-1">Channel ID</label>
            <input 
              type="text" 
              id="channelId" 
              name="channelId" 
              value={newChannel.channelId}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md bg-gray-700 text-white border-gray-600 shadow-sm p-3 text-base focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="channelName" className="block text-base font-medium text-gray-400 mb-1">Tên Kênh</label>
            <input 
              type="text" 
              id="channelName" 
              name="channelName" 
              value={newChannel.channelName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md bg-gray-700 text-white border-gray-600 shadow-sm p-3 text-base focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-base font-medium text-gray-400 mb-1">Mô tả (tùy chọn)</label>
            <textarea
              id="description"
              name="description"
              value={newChannel.description}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md bg-gray-700 text-white border-gray-600 shadow-sm p-3 text-base focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            ></textarea>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Thêm Kênh
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};