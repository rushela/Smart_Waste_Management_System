import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackToDashboardButton = ({ variant = 'primary', fullWidth = true, className = '' }) => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/payment');
  };

  const baseClasses = `font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:shadow-lg flex items-center justify-center space-x-3 group ${
    fullWidth ? 'w-full' : ''
  }`;

  const variants = {
    primary: `bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:scale-105 ${baseClasses}`,
    secondary: `bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400 ${baseClasses}`,
    outline: `bg-transparent hover:bg-green-50 text-green-600 border border-green-300 hover:border-green-500 ${baseClasses}`,
    ghost: `bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-800 ${baseClasses}`
  };

  const getButtonClasses = () => {
    return `${variants[variant]} ${className}`.trim();
  };

  const getIcon = () => {
    switch (variant) {
      case 'primary':
        return (
          <svg 
            className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        );
      case 'secondary':
        return (
          <svg 
            className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        );
      case 'outline':
        return (
          <svg 
            className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        );
      case 'ghost':
        return (
          <svg 
            className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        );
      default:
        return (
          <svg 
            className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        );
    }
  };

  const getText = () => {
    switch (variant) {
      case 'primary':
        return 'Back to EcoBinPay Dashboard';
      case 'secondary':
        return 'Return to Dashboard';
      case 'outline':
        return 'Back to Dashboard';
      case 'ghost':
        return 'Go Back';
      default:
        return 'Back to Dashboard';
    }
  };

  return (
    <button
      onClick={handleBackToDashboard}
      className={getButtonClasses()}
      aria-label="Return to payment dashboard"
    >
      {getIcon()}
      <span>{getText()}</span>
    </button>
  );
};

// Alternative version with more customization options
export const BackToDashboardButtonAdvanced = ({ 
  variant = 'primary', 
  size = 'lg',
  showIcon = true,
  customText,
  customIcon,
  onClick,
  className = '',
  ...props 
}) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    navigate('/payment');
  };

  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-5 text-base',
    lg: 'py-4 px-6 text-base',
    xl: 'py-5 px-7 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:scale-105',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400',
    outline: 'bg-transparent hover:bg-green-50 text-green-600 border border-green-300 hover:border-green-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-800',
    danger: 'bg-red-500 hover:bg-red-600 text-white hover:scale-105',
    success: 'bg-green-500 hover:bg-green-600 text-white hover:scale-105'
  };

  const baseClasses = `font-semibold rounded-xl transition-all duration-200 hover:shadow-lg flex items-center justify-center space-x-3 w-full ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  const defaultIcon = (
    <svg 
      className={`transition-transform duration-300 group-hover:-translate-x-1 ${
        size === 'sm' ? 'w-4 h-4' : 
        size === 'md' ? 'w-4 h-4' : 
        size === 'lg' ? 'w-5 h-5' : 
        'w-6 h-6'
      }`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );

  const defaultText = 'Back to Dashboard';

  return (
    <button
      onClick={handleClick}
      className={`group ${baseClasses}`}
      aria-label="Return to payment dashboard"
      {...props}
    >
      {showIcon && (customIcon || defaultIcon)}
      <span>{customText || defaultText}</span>
    </button>
  );
};

// Simple version for quick use
export const SimpleBackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/payment')}
      className="inline-flex items-center space-x-2 font-medium text-green-600 transition-colors duration-200 hover:text-green-700 group"
    >
      <svg 
        className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span>Back to Dashboard</span>
    </button>
  );
};

export default BackToDashboardButton;