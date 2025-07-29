import React from "react";
import { Button } from "@nextui-org/react";

const GradientButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  isLoading = false, 
  size = "md", 
  className = "",
  startContent,
  endContent,
  variant = "primary" // primary, success, danger
}) => {
  const getGradientClasses = () => {
    switch (variant) {
      case "success":
        return "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700";
      case "danger":
        return "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700";
      default:
        return "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700";
    }
  };

  return (
    <Button
      className={`${getGradientClasses()} text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 ${className}`}
      size={size}
      onPress={onClick}
      disabled={disabled || isLoading}
      startContent={!isLoading ? startContent : null}
      endContent={!isLoading ? endContent : null}
      radius="sm"
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Processing...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

const FloatingActionButton = ({ 
  onClick, 
  icon, 
  className = "",
  variant = "primary" 
}) => {
  const getGradientClasses = () => {
    switch (variant) {
      case "success":
        return "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700";
      case "danger":
        return "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700";
      default:
        return "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700";
    }
  };

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-14 h-14 ${getGradientClasses()} text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center z-50 ${className}`}
    >
      {icon}
    </button>
  );
};

export { GradientButton, FloatingActionButton };
