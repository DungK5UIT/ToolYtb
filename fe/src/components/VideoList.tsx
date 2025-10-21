import React, { useState } from 'react';
import { Video } from '../types';
import { PlayCircleIcon } from '@heroicons/react/24/outline'; 
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

// Component con để xử lý logic hiển thị mô tả
const DescriptionRenderer: React.FC<{ description: string }> = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionLimit = 150; 
  const showReadMore = description.length > descriptionLimit;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const displayedDescription = isExpanded || !showReadMore
    ? description
    : `${description.substring(0, descriptionLimit)}...`;

  return (
    <>
      <p className="text-xs text-gray-400 mt-1 italic leading-relaxed">{displayedDescription}</p>
      {showReadMore && (
        <button 
          onClick={toggleExpanded}
          className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-xs mt-1 block text-left"
        >
          {isExpanded ? 'Thu gọn' : 'Xem thêm'}
        </button>
      )}
    </>
  );
};

const VideoList: React.FC<{ videos: Video[] }> = ({ videos }) => {

  return (
    <div className="w-full text-sm text-gray-300">
      {/* Giao diện cho desktop */}
      <table className="hidden md:table min-w-full text-left bg-gray-900/50 rounded-xl shadow-2xl animate-fade-in-up">
        <thead className="text-sm uppercase text-gray-400">
          <tr className="border-b border-gray-700">
            <th className="p-4 w-5/12 font-semibold">Tiêu đề Video</th>
            <th className="p-4 w-2/12 font-semibold">Kênh</th>
            <th className="p-4 w-2/12 font-semibold">Ngày đăng</th>
            <th className="p-4 w-3/12 font-semibold">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => {
            const date = new Date(video.publishedAt);
            const formattedDate = `${date.getDate() < 10 ? '0' : ''}${date.getDate()}/${date.getMonth() + 1 < 10 ? '0' : ''}${date.getMonth() + 1}/${date.getFullYear()}`;
            
            return (
              <tr key={video.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200">
                <td className="p-4 font-medium text-white align-top">
                  <div className="flex items-start space-x-4">
                    <div className="relative w-32 h-auto aspect-video flex-shrink-0 group">
                      <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full rounded object-cover transition-transform duration-300 group-hover:scale-105" />
                      <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded">
                        <PlayCircleIcon className="h-10 w-10 text-white" />
                      </a>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-white text-base font-semibold">{video.title}</p>
                      <DescriptionRenderer description={video.description} />
                    </div>
                  </div>
                </td>
                <td className="p-4 align-top">
                  <p className="font-medium text-white">{video.channelName}</p>
                </td>
                <td className="p-4 align-top">
                  <p className="text-gray-400">{formattedDate}</p>
                </td>
                <td className="p-4 align-top">
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <a 
                      href={`https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-200 transform hover:scale-105 shadow-md"
                    >
                      <PlayCircleIcon className="h-4 w-4 mr-2" /> Xem trên YouTube
                    </a>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Giao diện cho mobile */}
      <div className="md:hidden space-y-4 animate-fade-in-up">
        {videos.map((video) => {
          const date = new Date(video.publishedAt);
          const formattedDate = `${date.getDate() < 10 ? '0' : ''}${date.getDate()}/${date.getMonth() + 1 < 10 ? '0' : ''}${date.getMonth() + 1}/${date.getFullYear()}`;
          
          return (
            <div key={video.id} className="bg-gray-900 rounded-lg shadow-lg p-4 transform transition-transform duration-200 hover:scale-[1.02] border border-gray-700">
              <div className="flex space-x-4">
                <div className="relative w-24 h-auto aspect-video flex-shrink-0 group">
                  <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full rounded object-cover transition-transform duration-300 group-hover:scale-105" />
                  <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded">
                    <PlayCircleIcon className="h-8 w-8 text-white" />
                  </a>
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <p className="font-semibold text-white text-sm">{video.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{video.channelName}</p>
                  <p className="text-xs text-gray-400">Ngày đăng: {formattedDate}</p>
                  <DescriptionRenderer description={video.description} />
                  <div className="mt-2 flex flex-col space-y-2">
                    <a 
                      href={`https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 text-xs shadow-md"
                    >
                      <PlayCircleIcon className="h-4 w-4 mr-1" /> Xem trên YouTube
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideoList;