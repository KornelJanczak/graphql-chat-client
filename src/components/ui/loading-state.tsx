"use client";

import React from "react";

interface LoadingStateProps {
  className?: string;
  text?: string;
}

export function LoadingState({
  className = "",
  text = "Loading...",
}: LoadingStateProps) {
  return (
    <div className={`flex justify-center items-center p-6 ${className}`}>
      <div className="flex flex-col items-center gap-2">
        <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-primary text-sm">{text}</span>
      </div>
    </div>
  );
}
