'use client';

import React from 'react';
import { ToastMessage } from './notification-toast';
import { cn } from '../../lib/utils';
import { Sparkles, Trophy, Bell, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationCenterProps {
  notifications: ToastMessage[];
  onDismiss: (id: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export function NotificationCenter({ notifications, onDismiss, onClearAll, className }: NotificationCenterProps) {
  
  const icons = {
    info: <Bell className="h-4 w-4 text-primary" />,
    success: <Trophy className="h-4 w-4 text-category-food" />,
    persona: <Sparkles className="h-4 w-4 text-white" />,
    milestone: <Trophy className="h-4 w-4 text-accent" />
  };

  return (
    <div className={cn('bg-surface border border-border p-5 rounded-2xl shadow-sm flex flex-col space-y-4 max-h-[400px] overflow-y-auto w-full max-w-sm', className)}>
      <div className="flex justify-between items-center pb-2 border-b border-border">
        <h4 className="font-bold text-text-primary font-display flex items-center space-x-2">
          <Bell className="h-4 w-4 text-primary" />
          <span>Notifications</span>
          {notifications.length > 0 && (
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full font-tabular">
              {notifications.length}
            </span>
          )}
        </h4>
        {notifications.length > 0 && onClearAll && (
          <button
            onClick={onClearAll}
            className="text-[10px] font-bold text-danger hover:underline flex items-center space-x-1 focus:outline-none cursor-pointer"
          >
            <Trash2 className="h-3 w-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        <AnimatePresence initial={false}>
          {notifications.length === 0 ? (
            <p className="text-xs text-text-muted text-center py-6">You have no new notifications.</p>
          ) : (
            notifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  'p-3.5 rounded-xl border border-border/80 flex items-start space-x-3 shadow-xs relative overflow-hidden',
                  notif.type === 'persona' ? 'bg-gradient-to-r from-primary/10 to-emerald-950/5 text-text-primary' : 'bg-surface-elevated'
                )}
              >
                {/* Icon Badge */}
                <div 
                  className={cn(
                    'p-2 rounded-lg flex items-center justify-center flex-shrink-0 bg-surface',
                    notif.type === 'persona' && 'text-white'
                  )}
                  style={notif.type === 'persona' && notif.color ? { backgroundColor: notif.color } : {}}
                >
                  {icons[notif.type]}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0 pr-4">
                  <h5 className="text-xs font-bold text-text-primary truncate">{notif.title}</h5>
                  <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">{notif.description}</p>
                </div>

                {/* Dismiss X */}
                <button
                  onClick={() => onDismiss(notif.id)}
                  className="absolute right-2 top-2 p-0.5 text-text-muted hover:text-text-primary focus:outline-none cursor-pointer"
                  aria-label="Dismiss notification"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
