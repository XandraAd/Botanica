import React from 'react'

const Message = ({ variant = "info", children }) => {
    const baseClasses = "p-4 rounded-md mb-4";
    const variantClasses = {
      danger: "bg-red-100 text-red-800 border border-red-300",
      success: "bg-green-100 text-green-800 border border-green-300",
      info: "bg-blue-100 text-blue-800 border border-blue-300",
      warning: "bg-yellow-100 text-yellow-800 border border-yellow-300"
    };
    
    return (
      <div className={`${baseClasses} ${variantClasses[variant] || variantClasses.info}`}>
        {children}
      </div>
    );
  };

export default Message