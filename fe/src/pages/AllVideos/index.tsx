import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideoList from '../../components/VideoList';
import Pagination from '../../components/Pagination';
import { useLatestVideos } from '../../hooks/useLatestVideos'; 
import { MagnifyingGlassIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ITEMS_PER_PAGE = 5;

const AllVideosPage = () => {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const channelIdFilter = searchParams.get('channelId');
  
  const { videos, loading, error, getVideos } = useLatestVideos();

  const filteredVideos = useMemo(() => {
    let list = videos;
    if (channelIdFilter) {
      list = list.filter(video => video.channelId === channelIdFilter);
    }
    if (searchTerm) {
      list = list.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (video.channelName && video.channelName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return list;
  }, [videos, channelIdFilter, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [channelIdFilter, searchTerm]);

  const totalPages = Math.ceil(filteredVideos.length / ITEMS_PER_PAGE);
  const currentVideos = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;
    return filteredVideos.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filteredVideos]);

  const handleRefresh = async () => {
    await getVideos();
  };
  
  const handleSearch = () => {
    // Logic tìm kiếm đã được xử lý bằng state `searchTerm`
  };
  
  // Hàm này giờ không còn cần nữa vì logic đã được chuyển sang VideoList.tsx
  // const handleDownload = async (videoId: string) => {
  //   setDownloading(true);
  //   setDownloadMessage('Đang tải video...');
  //   
  //   try {
  //     await downloadVideo(videoId);
  //     setDownloadMessage('Tải video thành công!');
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       setDownloadMessage(`Lỗi khi tải video: ${error.message}`);
  //     } else {
  //       setDownloadMessage('Đã xảy ra lỗi không xác định.');
  //     }
  //   } finally {
  //     setDownloading(false);
  //   }
  // };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6 mt-10">Video mới đăng</h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <span className="text-red-400">Lỗi: {error.message}</span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4 md:mb-6">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <input 
            type="text"
            placeholder="Tìm theo tiêu đề hoặc kênh..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
            Tìm kiếm
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400">Đang tải danh sách video...</div>
          </div>
        ) : (
          <>
            <VideoList videos={currentVideos} />
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={page => setCurrentPage(page)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AllVideosPage;