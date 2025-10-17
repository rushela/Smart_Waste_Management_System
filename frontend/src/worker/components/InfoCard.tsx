import React from 'react';
interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
const InfoCard: React.FC<InfoCardProps> = ({
  title,
  children,
  icon,
  className = '',
  onClick
}) => {
  const cardClasses = `
    bg-white 
    shadow-sm 
    rounded-2xl 
    p-4 
    mb-4
    ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow duration-200' : ''}
    ${className}
  `;
  return <div className={cardClasses} onClick={onClick}>
      <div className="flex items-center mb-2">
        {icon && <div className="mr-2 text-gray-600">{icon}</div>}
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
      </div>
      <div className="text-gray-700">{children}</div>
    </div>;
};
export default InfoCard;