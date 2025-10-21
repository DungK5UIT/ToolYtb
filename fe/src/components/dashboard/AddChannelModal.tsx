import React, { useState } from 'react';

interface AddChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChannelAdded?: (channelData: { channelId: string; channelName: string; description?: string }) => void;
}

const AddChannelModal: React.FC<AddChannelModalProps> = ({ isOpen, onClose, onChannelAdded }) => {
  const [channelId, setChannelId] = useState('');
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelId.trim() || !channelName.trim()) return;

    setIsSubmitting(true);
    const channelData = { 
      channelId: channelId.trim(), 
      channelName: channelName.trim(), 
      description: description.trim() || undefined 
    };
    
    console.log('Adding channel:', channelData);
    
    if (onChannelAdded) {
      onChannelAdded(channelData);
    } else {
      onClose();
    }
    
    setChannelId('');
    setChannelName('');
    setDescription('');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setChannelId('');
    setChannelName('');
    setDescription('');
    onClose();
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" 
      onClick={handleClose} 
    >
      <div 
        className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-4">Thêm kênh YouTube mới</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="channel-id" className="block text-sm font-medium text-gray-300 mb-1">
              Channel ID <span className="text-red-400">*</span>
            </label>
            <input 
              type="text" 
              id="channel-id" 
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              placeholder="UC_x5XG1OV2P6uZZ5FSM9Ttw" 
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
              disabled={isSubmitting}
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-1">
              ID của kênh YouTube (bắt đầu bằng UC...)
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="channel-name" className="block text-sm font-medium text-gray-300 mb-1">
              Tên kênh <span className="text-red-400">*</span>
            </label>
            <input 
              type="text" 
              id="channel-name" 
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="Tên kênh YouTube" 
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Mô tả (tùy chọn)
            </label>
            <textarea 
              id="description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả về kênh..." 
              rows={3}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button 
              type="button"
              onClick={handleClose} 
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              disabled={isSubmitting || !channelId.trim() || !channelName.trim()}
            >
              {isSubmitting ? 'Đang thêm...' : 'Thêm Kênh'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChannelModal;