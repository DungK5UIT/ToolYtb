import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface MainLayoutProps {
    onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 md:ml-20 lg:ml-64 transition-all duration-300">
        <Header onLogout={onLogout} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <div className="flex-1 pt-16 md:pt-0">
          <main className="min-h-full p-6 md:p-8">
            <div className="container mx-auto">
              <Outlet />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;