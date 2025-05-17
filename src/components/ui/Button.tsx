import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses = "font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  
  // Variant classes
  const variantClasses = {
    primary: "bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
    outline: "border border-amber-600 text-amber-600 hover:bg-amber-50 focus:ring-amber-500",
    ghost: "text-amber-600 hover:bg-amber-50 focus:ring-amber-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
  };
  
  // Width class
  const widthClass = fullWidth ? "w-full" : "";
  
  // Icon classes
  const hasIcon = !!icon;
  const iconClasses = hasIcon ? "inline-flex items-center justify-center" : "";
  
  // Combine all classes
  const combinedClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${widthClass}
    ${iconClasses}
    ${className}
  `;
  
  return (
    <button className={combinedClasses} {...props}>
      {hasIcon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {hasIcon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default Button;