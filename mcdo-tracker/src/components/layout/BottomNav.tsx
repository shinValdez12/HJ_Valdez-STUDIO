import React from 'react';
import { Home, Clock, Calendar, Plus, User } from 'lucide-react';
import { cn } from '../../utils/helpers';

export type NavPage = 'dashboard' | 'time' | 'calendar' | 'profile';

interface BottomNavProps {
  current: NavPage;
  onChange: (page: NavPage) => void;
  onAddEntry: () => void;
}

const NAV_ITEMS: { id: NavPage; label: string; icon: React.ComponentType<{ size?: string | number; className?: string }> }[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'time', label: 'History', icon: Clock },
  { id: 'profile', label: 'Settings', icon: User },
];

export default function BottomNav({ current, onChange, onAddEntry }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-surface-card-dark/90 backdrop-blur-xl border-t border-surface-border dark:border-surface-border-dark pb-safe">
      <div className="flex items-center justify-between px-2 h-16">
        {NAV_ITEMS.slice(0, 2).map(({ id, label, icon: Icon }) => {
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

        <button
          onClick={onAddEntry}
          aria-label="Add entry"
          className="relative -mt-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-red text-white shadow-2xl shadow-brand-red/20 border-4 border-white dark:border-surface-dark transition-transform duration-200 active:scale-95"
        >
          <Plus size={24} />
        </button>

        {NAV_ITEMS.slice(2).map(({ id, label, icon: Icon }) => {
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
