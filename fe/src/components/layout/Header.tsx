import React from 'react';
import { ArrowRightOnRectangleIcon, Bars3Icon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onLogout: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, onToggleSidebar }) => (
  <header className="fixed top-0 left-0 w-full bg-gray-900/50 backdrop-blur-md text-white px-4 shadow-xl flex items-center justify-between h-16 border-b border-gray-700 z-50 transition-all duration-300">
    <div className="flex items-center">
      <button 
        onClick={onToggleSidebar} 
        className="p-2 rounded-md hover:bg-gray-700 transition-colors"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>
      <div className="ml-4 flex items-center">
        <h1 className="font-extrabold text-3xl tracking-tight">
          <span className="text-red-500">Auto</span>
          <span className="text-white">mation</span>
        </h1>
      </div>
    </div>
    <button 
      onClick={onLogout} 
      className="flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors group"
    >
      <span className="mr-2 hidden sm:inline text-gray-300 group-hover:text-white transition-colors">Đăng xuất</span>
      <ArrowRightOnRectangleIcon className="h-6 w-6 text-gray-400 group-hover:text-white transition-colors" />
    </button>
  </header>
);
export default Header;