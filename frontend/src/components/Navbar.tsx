import { useEffect, useState } from 'react';
import { Recycle, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const isStaffOrAdmin = user?.role === 'staff' || user?.role === 'admin';
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-md' : 'bg-transparent'}`}>
      {/* subtle overlay when header is over the hero */}
      {!isScrolled && <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />}
          <div className="container mx-auto px-4 py-3 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Recycle className="h-8 w-8 text-[#2ECC71]" />
            <span className={`ml-2 font-bold text-lg md:text-xl ${isScrolled ? 'text-gray-800' : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]'}`}>
              Smart Waste Management System
            </span>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 flex-nowrap">
            <a href="/" className={`font-medium whitespace-nowrap ${isScrolled ? 'text-gray-800 hover:text-[#2ECC71]' : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] hover:text-[#FF8C42]'} transition-colors`}>
              Home
            </a>
            <Link to="#about" className={`font-medium whitespace-nowrap ${isScrolled ? 'text-gray-800 hover:text-[#2ECC71]' : 'text-white hover:text-[#FF8C42]'} transition-colors`}>
              About
            </Link>
            <Link to="#services" className={`font-medium whitespace-nowrap ${isScrolled ? 'text-gray-800 hover:text-[#2ECC71]' : 'text-white hover:text-[#FF8C42]'} transition-colors`}>
              Services
            </Link>
            <Link to="#contact" className={`font-medium whitespace-nowrap ${isScrolled ? 'text-gray-800 hover:text-[#2ECC71]' : 'text-white hover:text-[#FF8C42]'} transition-colors`}>
              Contact Us
            </Link>
            <Link to="/payments" className={`font-medium whitespace-nowrap ${isScrolled ? 'text-gray-800 hover:text-[#2ECC71]' : 'text-white hover:text-[#FF8C42]'} transition-colors`}>
              Payments 💳
            </Link>
            
            {user && (
              <Link to="/issues" className={`font-medium whitespace-nowrap ${isScrolled ? 'text-gray-800 hover:text-[#2ECC71]' : 'text-white hover:text-[#FF8C42]'} transition-colors`}>
                📝 Report Issue
              </Link>
            )}
            
            {isStaffOrAdmin && (
              <Link to="/admin/issues" className={`font-medium whitespace-nowrap ${isScrolled ? 'text-gray-800 hover:text-[#2ECC71]' : 'text-white hover:text-[#FF8C42]'} transition-colors`}>
                ⚙️ Manage Issues
              </Link>
            )}
            
            <Link to="/admin/pricing" className={`font-medium whitespace-nowrap ${isScrolled ? 'text-gray-800 hover:text-[#2ECC71]' : 'text-white hover:text-[#FF8C42]'} transition-colors`}>
              Admin Panel
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className={`font-medium whitespace-nowrap ${isScrolled ? 'text-gray-800 hover:text-[#2ECC71]' : 'text-white hover:text-[#FF8C42]'} transition-colors`}>
                  👤 {user.name}
                </Link>
                <button 
                  onClick={logout}
                  className="font-medium whitespace-nowrap text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full transition-colors flex-shrink-0"
                >
                  Logout
                </button>
              </div>
            ) : (
              <a href="/login" className="font-medium whitespace-nowrap text-white bg-[#FF8C42] hover:bg-[#e67e3a] px-4 py-2 rounded-full transition-colors flex-shrink-0">
                Login
              </a>
            )}
          </nav>
          {/* Mobile Menu Button */}
          <button className="md:hidden text-[#2ECC71]" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && <div className="md:hidden bg-white shadow-lg">
          <div className="flex flex-col space-y-4 px-4 py-6">
            <Link to="/" className="font-medium text-gray-800 hover:text-[#2ECC71] transition-colors">
              Home
            </Link>
            <Link to="#about" className="font-medium text-gray-800 hover:text-[#2ECC71] transition-colors">
              About
            </Link>
            <Link to="#services" className="font-medium text-gray-800 hover:text-[#2ECC71] transition-colors">
              Services
            </Link>
            <Link to="#contact" className="font-medium text-gray-800 hover:text-[#2ECC71] transition-colors">
              Contact Us
            </Link>
            <Link to="/payments" className="font-medium text-gray-800 hover:text-[#2ECC71] transition-colors">
              Payments 💳
            </Link>
            
            {user && (
              <Link to="/issues" className="font-medium text-gray-800 hover:text-[#2ECC71] transition-colors">
                📝 Report Issue
              </Link>
            )}
            
            {isStaffOrAdmin && (
              <Link to="/admin/issues" className="font-medium text-gray-800 hover:text-[#2ECC71] transition-colors">
                ⚙️ Manage Issues
              </Link>
            )}
            
            <Link to="/admin/pricing" className="font-medium text-gray-800 hover:text-[#2ECC71] transition-colors">
              Admin Panel
            </Link>
            
            {user ? (
              <>
                <Link to="/profile" className="font-medium text-gray-800 hover:text-[#2ECC71] transition-colors">
                  👤 Profile ({user.name})
                </Link>
                <button
                  onClick={logout}
                  className="font-medium text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full transition-colors text-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="font-medium text-white bg-[#FF8C42] hover:bg-[#e67e3a] px-4 py-2 rounded-full transition-colors text-center">
                Login
              </Link>
            )}
          </div>
        </div>}
    </header>;
};