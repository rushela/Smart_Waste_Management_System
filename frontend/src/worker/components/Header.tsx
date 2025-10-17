import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, LogOutIcon, MenuIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showLogout?: boolean;
  showMenu?: boolean;
  onMenuClick?: () => void;
}
const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showLogout = false,
  showMenu = false,
  onMenuClick
}) => {
  const navigate = useNavigate();
  const {
    logout
  } = useAuth();
  const handleBack = () => {
    navigate(-1);
  };
  const handleLogout = () => {
    logout();
    navigate('/worker/login');
  };
  return <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        {showBackButton && <button onClick={handleBack} className="mr-3 text-gray-600 hover:text-gray-800" aria-label="Go back">
            <ArrowLeftIcon size={20} />
          </button>}
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      </div>
      <div className="flex items-center">
        {showMenu && <button onClick={onMenuClick} className="text-gray-600 hover:text-gray-800 mr-3" aria-label="Menu">
            <MenuIcon size={20} />
          </button>}
        {showLogout && <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800" aria-label="Logout">
            <LogOutIcon size={20} />
          </button>}
      </div>
    </header>;
};
export default Header;