import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
    navigate('/'); 
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Đăng Nhập</h1>
          <p className="text-gray-400">Hệ thống giám sát YouTube Automation</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="email">Tài khoản</label>
            <input
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              type="email" id="email" placeholder="ten@example.com"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2" htmlFor="password">Mật khẩu</label>
            <input
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              type="password" id="password" placeholder="********"
            />
          </div>
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;