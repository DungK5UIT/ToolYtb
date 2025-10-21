import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="bg-gray-800 p-3 md:p-6 rounded-lg shadow-lg flex items-center">
    {icon}
    <div className="ml-3 md:ml-4">
      <p className="text-xs md:text-sm text-gray-400">{title}</p>
      <p className="text-lg md:text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default StatCard;