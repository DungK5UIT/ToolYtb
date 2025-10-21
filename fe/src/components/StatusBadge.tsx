import React from 'react';

interface StatusBadgeProps {
  status: 'Hoạt động' | 'Tạm dừng' | 'Lỗi' | string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
  let specificClasses = "";

  switch (status) {
    case 'Hoạt động':
      specificClasses = "bg-green-500/20 text-green-400";
      break;
    case 'Tạm dừng':
      specificClasses = "bg-yellow-500/20 text-yellow-400";
      break;
    case 'Lỗi':
      specificClasses = "bg-red-500/20 text-red-400";
      break;
    default:
      specificClasses = "bg-gray-500/20 text-gray-400";
  }

  return <span className={`${baseClasses} ${specificClasses}`}>{status}</span>;
};

export default StatusBadge;