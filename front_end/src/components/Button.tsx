import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors duration-200 rounded';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover shadow-light',
    secondary: 'bg-secondary text-white hover:bg-secondary-hover shadow-light',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-text-secondary hover:text-primary hover:bg-bg-input'
  };

  const sizes = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-5 text-sm font-semibold',
    lg: 'py-2.5 px-6 text-base font-semibold'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
