import React from 'react';
import { InformationCircleIcon, PlayCircleIcon, PlusCircleIcon, Cog6ToothIcon, ClockIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const UserGuidePage: React.FC = () => {
  return (
    <div className="flex justify-center pt-8 md:pt-20 text-gray-200">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-white flex items-center justify-center space-x-2">
          <InformationCircleIcon className="h-8 w-8 text-blue-400" />
          <span>Hướng dẫn sử dụng</span>
        </h1>

        <div className="space-y-8">
          {/* Mục Tổng quan */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold mb-4 text-white">
              <PlayCircleIcon className="h-6 w-6 inline-block mr-2 text-green-500" />
              Tổng quan về dự án Automation
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Dự án <strong className="text-white">Youtube Automation</strong> được xây dựng nhằm giúp bạn tự động hóa việc theo dõi và tải về các video từ các kênh YouTube yêu thích. Với công cụ này, bạn có thể dễ dàng quản lý các kênh đã theo dõi, xem video mới nhất và tải xuống chúng với chất lượng mong muốn.
            </p>
          </div>

          {/* Các chức năng chính */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold mb-4 text-white">
              <Cog6ToothIcon className="h-6 w-6 inline-block mr-2 text-purple-400" />
              Các chức năng chính
            </h2>
            <ul className="list-disc list-inside space-y-3 text-gray-400">
              <li>
                <span className="font-semibold text-white">Theo dõi kênh:</span> Dễ dàng thêm các kênh YouTube mới để theo dõi.
              </li>
              <li>
                <span className="font-semibold text-white">Quản lý kênh:</span> Xem danh sách các kênh đã theo dõi và ngưng theo dõi khi không cần nữa.
              </li>
              <li>
                <span className="font-semibold text-white">Video mới đăng:</span> Luôn cập nhật những video mới nhất từ các kênh của bạn.
              </li>
              <li>
                <span className="font-semibold text-white">Tải video:</span> Tải trực tiếp video từ danh sách về máy tính của bạn với hai tùy chọn chất lượng: 1080p và 720p.
              </li>
            </ul>
          </div>

          {/* Hướng dẫn chi tiết */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold mb-4 text-white">
              <PlayCircleIcon className="h-6 w-6 inline-block mr-2 text-red-400" />
              Hướng dẫn sử dụng chi tiết
            </h2>
            
            <div className="space-y-6 text-gray-400">
              {/* Thêm kênh mới */}
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center mb-2">
                  <PlusCircleIcon className="h-5 w-5 mr-2 text-green-400" /> 1. Cách theo dõi một kênh mới
                </h3>
                <ol className="list-decimal list-inside ml-4 space-y-1">
                  <li>Điều hướng đến trang <span className="font-medium text-white">"Kênh đang theo dõi"</span>.</li>
                  <li>Sử dụng ô tìm kiếm để nhập ID hoặc URL của kênh YouTube. Ví dụ: <span className="text-gray-400"></span> <span className="font-medium text-white">UCW3HksNISmDo6w1Ft3fxAIw</span> được lấy ở <span className="text-gray-400">URL:</span> <span className="font-medium text-white">https://www.youtube.com/channel/UCW3HksNISmDo6w1Ft3fxAIw</span></li>
                  {/* <li>Hệ thống sẽ tự động tìm kiếm và hiển thị thông tin kênh.</li> */}
                  <li>Nhấn nút <span className="font-medium text-white">"Theo dõi"</span> để thêm kênh vào danh sách.</li>
                </ol>
              </div>

              {/* Tải video */}
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center mb-2">
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2 text-blue-400" /> 2. Cách tải video
                </h3>
                <ol className="list-decimal list-inside ml-4 space-y-1">
                  <li>Khi có video mới của kênh bạn đang theo dõi, hệ thống sẽ tự động phát hiện.</li>
                  <li>Video sẽ được tự động tải về và lưu vào thư mục Tải xuống của trình duyệt.</li>
                  <li>Bạn có thể truy cập trang <span className="font-medium text-white">"Video mới đăng"</span> để theo dõi danh sách các video đã được tải về.</li>
                  {/* <li>Ngoài ra, bạn sẽ nhận được thông báo qua <span className="font-medium text-white">"Gmail cá nhân"</span> khi quá trình tải hoàn tất.</li> */}
                </ol>
              </div>

              {/* Quản lý kênh */}
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center mb-2">
                  <Cog6ToothIcon className="h-5 w-5 mr-2 text-purple-400" /> 3. Quản lý kênh đã theo dõi
                </h3>
                <ol className="list-decimal list-inside ml-4 space-y-1">
                  <li>Vào trang <span className="font-medium text-white">"Quản lý kênh"</span> để xem tất cả các kênh bạn đang theo dõi.</li>
                  <li>Nếu bạn muốn ngừng theo dõi một kênh, chỉ cần nhấn vào nút <span className="font-medium text-white">"Ngừng theo dõi"</span> tương ứng.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuidePage;