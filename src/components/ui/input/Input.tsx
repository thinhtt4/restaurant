import {  RectangleEllipsis } from "lucide-react"; // Nhớ import icon
import React, { useState, forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "number" | "email" | "password";
  autoComplete?: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      icon,
      autoComplete,
      className,
      placeholder,
      required,
      error,
      ...rest
    },
    ref
  ) => {
  
    const [showPassword, setShowPassword] = useState(false);


    const isPasswordType = type === "password";
    const inputType = isPasswordType ? (showPassword ? "text" : "password") : type;

    const baseClass =
      "w-full px-[20px] py-[17px] bg-color-input border-0 outline-none text-[17px] rounded-lg";

    const errorStyles = error
      ? "ring-1 ring-red-500 ring-offset-1 focus:ring-red-500"
      : "";

    // Hàm toggle
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="mb-[13px]">
        <div className="relative">
          <input
            ref={ref} // Gắn ref vào đây
            type={inputType}
            autoComplete={autoComplete}
            className={`${baseClass} ${errorStyles} ${className || ""}`}
            placeholder={placeholder}
            required={required}
            {...rest}
          />

          {/* Logic hiển thị Icon */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            {isPasswordType ? (
            
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-gray-500 hover:text-gray-700 focus:outline-none flex items-center"
                tabIndex={-1} 
              >
                {showPassword ? <RectangleEllipsis size={20} /> : <RectangleEllipsis size={20} />}
              </button>
            ) : (
              // Nếu không phải password thì hiện icon truyền vào từ props (nếu có)
              icon && <span className="pointer-events-none text-gray-500">{icon}</span>
            )}
          </div>
        </div>

        {error && (
          <p className="text-sm text-left text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

export default Input;