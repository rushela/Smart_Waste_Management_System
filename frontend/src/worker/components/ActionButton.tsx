import React from 'react';
interface ActionButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  icon,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = ''
}) => {
  const baseStyles = 'flex items-center justify-center rounded-xl px-4 py-3 font-medium transition-colors duration-200';
  const variantStyles = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white',
    secondary: 'bg-blue-500 hover:bg-blue-600 text-white',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-800'
  };
  const widthStyles = fullWidth ? 'w-full' : '';
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  return <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${disabledStyles} ${className}`}>
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>;
};
export default ActionButton;