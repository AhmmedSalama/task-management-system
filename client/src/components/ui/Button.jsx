import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const baseStyle = "inline-flex justify-center items-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md",
    outline: "bg-white text-blue-600 border border-gray-200 hover:bg-gray-50 focus:ring-blue-500 shadow-md",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;