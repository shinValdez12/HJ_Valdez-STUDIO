import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({ open, onClose, title, children, className }: ModalProps) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      // Scroll modal content to top when opening
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
      // Also scroll the modal body to top
      if (bodyRef.current) {
        bodyRef.current.scrollTop = 0;
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-start pt-4 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Modal Container */}
      <div className={cn(
        'relative w-full max-w-lg bg-white dark:bg-surface-card-dark rounded-t-3xl',
        'max-h-[95vh] flex flex-col',
        'animate-slide-up shadow-2xl',
        className
      )}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-surface-border dark:border-surface-border-dark flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}
        {/* Scrollable Body */}
        <div 
          ref={bodyRef}
          className="flex-1 overflow-y-auto"
        >
          <div className="px-5 py-4 pb-20">{children}</div>
        </div>
      </div>
    </div>
  );
}
