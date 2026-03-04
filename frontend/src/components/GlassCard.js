import React from 'react';
import { cn } from '@/lib/utils';

export const GlassCard = ({ children, className, hover = false, ...props }) => {
  return (
    <div
      className={cn(
        'glass-card',
        hover && 'glass-card-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};