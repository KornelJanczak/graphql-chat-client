"use client";

import React from "react";

interface EmptyStateProps {
  message: string;
  className?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  message,
  className = "",
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className={`flex justify-center items-center p-6 ${className}`}>
      <div className="flex flex-col items-center gap-3 text-center">
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <span className="text-muted-foreground">{message}</span>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}
