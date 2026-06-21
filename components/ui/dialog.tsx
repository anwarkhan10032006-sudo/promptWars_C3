'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ isOpen, onClose, title, children, className }: DialogProps) {
  // Prevent page scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ 
              opacity: 0, 
              y: window.innerWidth < 768 ? '100%' : 20,
              scale: window.innerWidth < 768 ? 1 : 0.95 
            }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: 1 
            }}
            exit={{ 
              opacity: 0, 
              y: window.innerWidth < 768 ? '100%' : 15,
              scale: window.innerWidth < 768 ? 1 : 0.95 
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={cn(
              // Mobile Bottom Sheet styles
              'relative z-10 w-full max-h-[85vh] overflow-y-auto bg-surface border-t border-border rounded-t-2xl p-6 shadow-lg md:max-w-lg md:rounded-2xl md:border md:border-border md:mb-0',
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              {title && <h2 className="text-xl font-semibold font-display text-text-primary">{title}</h2>}
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="p-1 rounded-full text-text-secondary hover:bg-border/30 hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="relative text-text-secondary">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
