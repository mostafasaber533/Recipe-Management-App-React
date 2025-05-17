import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  hover = false
}) => {
  const baseClasses = "bg-white rounded-lg shadow-md overflow-hidden";
  const hoverClasses = hover 
    ? "transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer" 
    : "";
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export interface CardImageProps {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'auto';
  className?: string;
}

export const CardImage: React.FC<CardImageProps> = ({ 
  src, 
  alt,
  aspectRatio = 'video',
  className = '' 
}) => {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: ''
  };
  
  return (
    <div className={`${aspectClasses[aspectRatio]} overflow-hidden ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ 
  children,
  className = ''
}) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ 
  children,
  className = ''
}) => {
  return (
    <h3 className={`font-bold text-lg mb-2 ${className}`}>
      {children}
    </h3>
  );
};

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ 
  children,
  className = ''
}) => {
  return (
    <p className={`text-gray-600 ${className}`}>
      {children}
    </p>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ 
  children,
  className = ''
}) => {
  return (
    <div className={`px-4 py-3 bg-gray-50 ${className}`}>
      {children}
    </div>
  );
};

export default Card;