import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
}) => {
  const baseStyles = 'px-6 py-3  font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-500 hover:to-yellow-600 shadow-lg hover:shadow-xl',
    secondary: 'bg-black text-white hover:bg-gray-900 border border-amber-400',
    outline: 'border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
