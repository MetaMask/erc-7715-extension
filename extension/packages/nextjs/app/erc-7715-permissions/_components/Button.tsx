"use client";

import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void | Promise<void>;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-8 py-3 border-2 border-white text-white font-semibold rounded hover:bg-white hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);
