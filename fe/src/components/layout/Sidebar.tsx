import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  ClipboardDocumentListIcon,
  FolderArrowDownIcon,
  Cog6ToothIcon,
  XMarkIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

interface NavLinkProps {
  to: string;
  isOpen: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
  onNavigate: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, isOpen, icon, children, onNavigate }) => {
  return (
    <RouterNavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center p-3 my-1 rounded-lg text-gray-300 transition-colors duration-200
         hover:bg-gray-700 hover:text-white
         ${isActive ? 'bg-red-600 text-white shadow-lg' : ''}
         ${isOpen ? '' : 'justify-center'}`
      }
    >
      {icon}
      <span className={`ml-4 whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 absolute -z-10'}`}>
        {children}
      </span>
    </RouterNavLink>
  );
};

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const handleNavigate = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false); 
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-30 md:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside 
        className={`fixed top-0 left-0 bottom-0 bg-gray-800 text-white
                    transition-all duration-300 ease-in-out z-40
                    ${isOpen 
                        ? 'w-64 translate-x-0' 
                        : '-translate-x-full w-64 md:w-20 md:translate-x-0'}`}
      >
        <div className="h-16 flex items-center justify-between p-4 flex-shrink-0">
            <h1 className={`font-extrabold text-2xl tracking-tight transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                <span className="text-red-500">Auto</span>
                <span className="text-white">mation</span>
            </h1>
            <button
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-md hover:bg-gray-700 transition-colors md:hidden ${isOpen ? 'block' : 'hidden'}`}
            >
                <XMarkIcon className="h-6 w-6" />
            </button>
        </div>
        <nav className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent flex-1">
            <div className="p-4 space-y-2">
                <NavLink to="/" isOpen={isOpen} icon={<HomeIcon className="h-6 w-6" />} onNavigate={handleNavigate}>
                    Dashboard
                </NavLink>
                <NavLink to="/channels" isOpen={isOpen} icon={<ClipboardDocumentListIcon className="h-6 w-6" />} onNavigate={handleNavigate}>
                    Kênh đang theo dõi
                </NavLink>
                <NavLink to="/videos" isOpen={isOpen} icon={<FolderArrowDownIcon className="h-6 w-6" />} onNavigate={handleNavigate}>
                    Video mới đăng
                </NavLink>
                <NavLink to="/api-keys" isOpen={isOpen} icon={<Cog6ToothIcon className="h-6 w-6" />} onNavigate={handleNavigate}>
                  Quản lý API Keys
                </NavLink>
                <NavLink to="/settings" isOpen={isOpen} icon={<BookOpenIcon className="h-6 w-6" />} onNavigate={handleNavigate}>
                  Hướng dẫn sử dụng
                </NavLink>
            </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;