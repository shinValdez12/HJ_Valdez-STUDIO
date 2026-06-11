import React from 'react';
import { Home, Clock, Calendar, BarChart2, User } from 'lucide-react';
import { cn } from '../../utils/helpers';

export type NavPage = 'dashboard' | 'time' | 'calendar' | 'reports' | 'profile';

interface BottomNavProps {
  current: NavPage;
  onChange: (page: NavPage) => void;
}

const NAV_ITEMS: { id: NavPage; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'time', label: 'Time', icon: Clock },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'reports', label: 'Reports', icon: BarChart2 },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function BottomNav({ current, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-surface-card-dark/90 backdrop-blur-xl border-t border-surface-border dark:border-surface-border-dark pb-safe">
      <div className="flex items-center justify-around px-2 h-16">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = current === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 h-full rounded-2xl transition-all duration-200 touch-manipulation',
                active ? 'text-brand-red' : 'text-gray-400 dark:text-gray-500'
              )}
              aria-label={label}
            >
              <div className={cn(
                'p-1.5 rounded-xl transition-all duration-200',
                active && 'bg-brand-red/10'
              )}>
                <Icon size={22} className={cn(active && 'drop-shadow-sm')} />
              </div>
              <span className={cn(
                'text-[10px] font-medium leading-none',
                active ? 'text-brand-red' : 'text-gray-400 dark:text-gray-500'
              )}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
