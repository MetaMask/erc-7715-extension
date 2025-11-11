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
    className="px-8 py-3 border-2 border-neutral text-neutral font-semibold rounded hover:bg-neutral hover:text-neutral-content transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);
