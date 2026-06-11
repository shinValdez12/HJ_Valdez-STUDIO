import React from 'react';
import { cn } from '../../utils/helpers';

interface StatBadgeProps {
  label: string;
  value: string | number;
  color?: 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'gray';
  icon?: React.ReactNode;
  className?: string;
}

const colorMap = {
  green: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
  red: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400',
  yellow: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
  blue: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400',
  purple: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400',
  gray: 'bg-gray-50 dark:bg-gray-900/40 text-gray-700 dark:text-gray-400',
};

export default function StatBadge({ label, value, color = 'gray', icon, className }: StatBadgeProps) {
  return (
    <div className={cn('flex flex-col gap-1 p-3 rounded-2xl', colorMap[color], className)}>
      {icon && <div className="opacity-70">{icon}</div>}
      <div className="text-xl font-bold leading-none">{value}</div>
      <div className="text-[11px] font-medium opacity-70 leading-none">{label}</div>
    </div>
  );
}
