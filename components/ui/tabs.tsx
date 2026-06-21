'use client';

import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../lib/utils';

interface TabsContextProps {
  value: string;
  onValueChange: (val: string) => void;
}

const TabsContext = createContext<TabsContextProps | null>(null);

export function Tabs({ 
  value, 
  defaultValue, 
  onValueChange, 
  children, 
  className 
}: { 
  value?: string; 
  defaultValue?: string; 
  onValueChange?: (val: string) => void; 
  children: React.ReactNode; 
  className?: string;
}) {
  const [localVal, setLocalVal] = useState(defaultValue || '');
  const activeValue = value !== undefined ? value : localVal;
  
  const handleValueChange = (val: string) => {
    if (value === undefined) {
      setLocalVal(val);
    }
    if (onValueChange) {
      onValueChange(val);
    }
  };

  return (
    <TabsContext.Provider value={{ value: activeValue, onValueChange: handleValueChange }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('inline-flex h-12 items-center justify-start rounded-lg bg-surface-elevated border border-border p-1 text-text-secondary w-full md:w-auto', className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used inside Tabs');

  const isActive = context.value === value;

  return (
    <button
      type="button"
      onClick={() => context.onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 text-text-secondary cursor-pointer',
        isActive && 'bg-surface text-text-primary shadow-sm font-semibold border border-border/60',
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used inside Tabs');

  const isActive = context.value === value;

  if (!isActive) return null;

  return (
    <div className={cn('mt-4 focus-visible:outline-none', className)}>
      {children}
    </div>
  );
}
