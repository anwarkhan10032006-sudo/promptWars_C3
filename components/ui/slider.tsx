import React from 'react';
import { cn } from '../../lib/utils';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  displayValue?: string;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onChange, min = 0, max = 100, step = 1, label, displayValue, ...props }, ref) => {
    return (
      <div className={cn('w-full flex flex-col space-y-2', className)}>
        {(label || displayValue) && (
          <div className="flex justify-between items-center text-sm font-medium">
            {label && <span className="text-text-secondary">{label}</span>}
            {displayValue && <span className="text-primary font-semibold font-tabular">{displayValue}</span>}
          </div>
        )}
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = 'Slider';
