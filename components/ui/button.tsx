import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] duration-100 cursor-pointer',
          // Variants
          variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-opacity-90 focus-visible:ring-primary',
          variant === 'secondary' && 'bg-surface-elevated border border-border text-text-primary hover:bg-border/20 focus-visible:ring-primary',
          variant === 'outline' && 'border border-border bg-transparent hover:bg-surface-elevated text-text-primary focus-visible:ring-primary',
          variant === 'ghost' && 'hover:bg-surface-elevated text-text-secondary hover:text-text-primary focus-visible:ring-primary',
          variant === 'accent' && 'bg-accent text-accent-foreground hover:bg-opacity-90 focus-visible:ring-accent',
          variant === 'danger' && 'bg-danger text-white hover:bg-opacity-90 focus-visible:ring-danger',
          // Sizes
          size === 'sm' && 'h-9 px-3 text-sm',
          size === 'md' && 'h-11 px-5 text-base',
          size === 'lg' && 'h-12 px-6 text-lg',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
