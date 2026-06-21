'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Trophy, BellRing } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'persona' | 'milestone';
  title: string;
  description: string;
  color?: string; // Hex for custom colors (e.g., persona color)
}

interface NotificationToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
  durationMs?: number;
  className?: string;
}

export function NotificationToast({ toast, onClose, durationMs = 6000, className }: NotificationToastProps) {
  
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, durationMs);
      return () => clearTimeout(timer);
    }
  }, [toast, durationMs, onClose]);

  if (!toast) return null;

  const icons = {
    info: <BellRing className="h-5 w-5 text-primary" />,
    success: <Trophy className="h-5 w-5 text-category-food" />,
    persona: <Sparkles className="h-5 w-5 text-white" />,
    milestone: <Trophy className="h-5 w-5 text-accent" />
  };

  const bgStyles = {
    info: 'bg-surface border-border',
    success: 'bg-surface border-category-food/20',
    persona: 'bg-gradient-to-r from-primary/95 to-emerald-950/95 text-white border-primary/20',
    milestone: 'bg-surface border-accent/20'
  };

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-[100] w-full max-w-sm px-4 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 250 }}
          className={cn(
            'flex items-start space-x-3.5 p-4 rounded-xl border shadow-lg overflow-hidden relative backdrop-blur-sm',
            bgStyles[toast.type],
            className
          )}
        >
          {/* Icon Badge */}
          <div 
            className={cn(
              'p-2.5 rounded-lg flex items-center justify-center flex-shrink-0',
              toast.type === 'persona' ? 'bg-primary/20' : 'bg-surface-elevated border border-border/40'
            )}
            style={toast.type === 'persona' && toast.color ? { backgroundColor: toast.color } : {}}
          >
            {icons[toast.type]}
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <h4 className={cn('text-sm font-bold font-display', toast.type === 'persona' ? 'text-white' : 'text-text-primary')}>
              {toast.title}
            </h4>
            <p className={cn('text-xs mt-1 leading-relaxed', toast.type === 'persona' ? 'text-emerald-100/90' : 'text-text-secondary')}>
              {toast.description}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className={cn(
              'p-1 rounded-full focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer',
              toast.type === 'persona' ? 'text-emerald-100/50 hover:text-white' : 'text-text-muted hover:text-text-primary'
            )}
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
