import React, { useState, useMemo } from 'react';
import { 
  ListBulletIcon, 
  ClockIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useLatestVideos } from '../../hooks/useLatestVideos';
import StatCard from '../../components/dashboard/StatCard';
import VideoList from '../../components/VideoList';
import Pagination from '../../components/Pagination'; 

const ITEMS_PER_PAGE = 5;

const DashboardPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { 
    stats, 
    loading: statsLoading, 
    error: statsError 
  } = useDashboardStats();

  const { 
    videos, 
    loading: videosLoading, 
    error: videosError
  } = useLatestVideos();

  const safeGet = (value: number | undefined | null, fallback: number = 0): number => {
    return value !== undefined && value !== null ? value : fallback;
  };

  const totalPages = Math.ceil(videos.length / ITEMS_PER_PAGE);
  
  const currentVideos = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;
    return videos.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, videos]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4 mt-10">YouTube Automation</h1>
      </div>
{/* Dashboard */}
      {statsError && (
        <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <span className="text-red-400">Lỗi tải thống kê: {statsError.message}</span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        <StatCard 
          title="Tổng Kênh Đã Theo Dõi" 
          value={statsLoading ? "..." : safeGet(stats?.totalChannels).toLocaleString()} 
          icon={<ListBulletIcon className="h-10 w-10 text-blue-500" />} 
        />
        <StatCard 
          title="Kênh Đang Hoạt Động" 
          value={statsLoading ? "..." : safeGet(stats?.activeChannels).toLocaleString()} 
          icon={<ClockIcon className="h-10 w-10 text-green-500" />} 
        />
        <StatCard 
          title="Kênh Đã Dừng" 
          value={statsLoading ? "..." : safeGet(stats?.inactiveChannels).toLocaleString()} 
          icon={<ExclamationTriangleIcon className="h-10 w-10 text-red-500" />} 
        />
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Video Gần Đây</h2>
            <div className="text-sm text-gray-400">
              {videos.length > 0 && (
                <>Hiển thị {videos.length} video</>
              )}
            </div>
          </div>

          {videosError && (
            <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                <span className="text-red-400">Lỗi tải danh sách video: {videosError.message}</span>
              </div>
            </div>
          )}

          {videosLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-400">Đang tải danh sách video...</span>
            </div>
          ) : (
            <>
              <VideoList videos={currentVideos} />
              {totalPages > 1 && (
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={page => setCurrentPage(page)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;