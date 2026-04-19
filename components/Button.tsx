
import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  className = '',
  type = 'button',
  disabled = false
}) => {
  const baseStyles = 'px-6 py-2.5 font-bold rounded-full transition-all duration-300 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2';

  const variantStyles = {
    primary: 'bg-hungers-lime-500 text-hungers-green-950 hover:bg-hungers-lime-400 focus:ring-hungers-lime-200 shadow-lime',
    secondary: 'bg-hungers-green-900 text-white hover:bg-hungers-green-800 focus:ring-hungers-green-200 shadow-premium',
    outline: 'bg-transparent border-2 border-hungers-green-900 text-hungers-green-900 hover:bg-hungers-green-50 focus:ring-hungers-green-100',
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

export default Button;
