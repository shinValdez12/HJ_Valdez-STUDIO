import React from 'react';
import { cn } from '../../utils/helpers';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glass?: boolean;
}

export default function Card({ children, className, onClick, glass }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-3xl p-4 transition-all duration-200',
        glass
          ? 'bg-white/60 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10'
          : 'bg-white dark:bg-surface-card-dark shadow-card',
        onClick && 'cursor-pointer active:scale-[0.98] hover:shadow-card-hover',
        className
      )}
    >
      {children}
    </div>
  );
}
