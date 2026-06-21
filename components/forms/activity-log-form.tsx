'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Category, CategoryEnum } from '../../types';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { AlertCircle } from 'lucide-react';

// Form validation schema
const logFormSchema = z.object({
  category: CategoryEnum,
  subcategory: z.string().min(1, 'Please select a subcategory'),
  quantity: z.number({ message: 'Please enter a valid number' })
    .positive('Quantity must be greater than zero')
    .max(100000, 'Value is abnormally high'),
  occurred_at: z.string().min(1, 'Please select a date')
});

type LogFormValues = z.infer<typeof logFormSchema>;

interface ActivityLogFormProps {
  onSubmitSuccess: (data: any) => void;
  defaultCategory?: Category;
  className?: string;
}

export function ActivityLogForm({ onSubmitSuccess, defaultCategory = 'transportation', className }: ActivityLogFormProps) {
  const [activeCategory, setActiveCategory] = useState<Category>(defaultCategory);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Define category specific dropdown items and units
  const categoryConfig = {
    transportation: {
      unit: 'km',
      label: 'Commuting Distance',
      subcategories: ['Petrol Car', 'Bus/Transit', 'Electric Vehicle']
    },
    electricity: {
      unit: 'kWh / Therms',
      label: 'Energy Consumed',
      subcategories: ['Grid Electricity', 'Natural Gas Heating']
    },
    food: {
      unit: 'days',
      label: 'Diet Duration',
      subcategories: ['Vegan Diet Plan', 'Vegetarian Meal', 'Flexitarian Grocery Mix', 'Meat-Heavy Grocery Mix']
    },
    shopping: {
      unit: 'USD',
      label: 'Transaction Amount',
      subcategories: ['Discretionary Spend', 'Thrift Store Clothing']
    },
    flights: {
      unit: 'flights',
      label: 'Number of flights',
      subcategories: ['Short-haul Flight', 'Medium-haul Flight', 'Long-haul Flight']
    }
  };

  const config = categoryConfig[activeCategory];

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<LogFormValues>({
    resolver: zodResolver(logFormSchema),
    defaultValues: {
      category: activeCategory,
      subcategory: config.subcategories[0],
      quantity: activeCategory === 'flights' || activeCategory === 'food' ? 1 : 10,
      occurred_at: new Date().toISOString().substring(0, 16) // Format as YYYY-MM-DDTHH:MM
    }
  });

  const handleCategoryTabChange = (cat: Category) => {
    setActiveCategory(cat);
    setValue('category', cat);
    // Reset fields to appropriate defaults for the new category
    setValue('subcategory', categoryConfig[cat].subcategories[0]);
    setValue('quantity', cat === 'flights' || cat === 'food' ? 1 : 10);
  };

  const handleFormSubmit = async (values: LogFormValues) => {
    setSubmitting(true);
    setErrorMsg('');
    try {
      // In a real app this hits a Server Action or API
      // We trigger the success callback with the values
      await onSubmitSuccess(values);
      reset({
        category: activeCategory,
        subcategory: config.subcategories[0],
        quantity: activeCategory === 'flights' || activeCategory === 'food' ? 1 : 10,
        occurred_at: new Date().toISOString().substring(0, 16)
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while logging activity.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={cn('space-y-4 bg-surface p-2 rounded-xl', className)}>
      
      {/* Category selector Tab strip */}
      <div>
        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Select Category</label>
        <div className="flex border border-border bg-surface-elevated p-1 rounded-xl w-full overflow-x-auto space-x-1">
          {(['transportation', 'electricity', 'food', 'shopping', 'flights'] as Category[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryTabChange(cat)}
              className={cn(
                'flex-1 text-[11px] font-bold py-2 rounded-lg capitalize transition-all cursor-pointer whitespace-nowrap px-3 text-center focus:outline-none',
                activeCategory === cat 
                  ? 'bg-surface text-text-primary shadow-sm border border-border/80' 
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory select */}
      <div>
        <label htmlFor="subcategory" className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
          Type / Subcategory
        </label>
        <select
          id="subcategory"
          {...register('subcategory')}
          className="w-full h-11 border border-border rounded-lg px-3 bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
        >
          {config.subcategories.map((sub) => (
            <option key={sub} value={sub}>
              {sub} ({activeCategory === 'electricity' ? (sub.includes('Electricity') ? 'kWh' : 'Therms') : config.unit})
            </option>
          ))}
        </select>
        {errors.subcategory && (
          <p className="text-xs text-danger mt-1 flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.subcategory.message}</span>
          </p>
        )}
      </div>

      {/* Quantity & Unit */}
      <div>
        <label htmlFor="quantity" className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
          {config.label}
        </label>
        <div className="relative flex items-center">
          <input
            id="quantity"
            type="number"
            step="any"
            {...register('quantity', { valueAsNumber: true })}
            className="w-full h-11 border border-border rounded-lg pl-3 pr-16 bg-surface text-text-primary font-tabular text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="0.0"
          />
          <div className="absolute right-3 text-xs font-bold text-text-muted uppercase pointer-events-none">
            {activeCategory === 'electricity' ? 'Value' : config.unit}
          </div>
        </div>
        {errors.quantity && (
          <p className="text-xs text-danger mt-1 flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.quantity.message}</span>
          </p>
        )}
      </div>

      {/* Occurred At Date Time */}
      <div>
        <label htmlFor="occurred_at" className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
          Date & Time
        </label>
        <input
          id="occurred_at"
          type="datetime-local"
          {...register('occurred_at')}
          className="w-full h-11 border border-border rounded-lg px-3 bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.occurred_at && (
          <p className="text-xs text-danger mt-1 flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.occurred_at.message}</span>
          </p>
        )}
      </div>

      {/* Global error message */}
      {errorMsg && (
        <div className="p-3 bg-danger/10 border border-danger/25 text-danger rounded-lg text-xs flex items-center space-x-2">
          <AlertCircle className="h-4 w-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        disabled={submitting}
        className="w-full h-11 font-semibold text-sm"
      >
        {submitting ? 'Logging...' : 'Log Carbon Activity'}
      </Button>

    </form>
  );
}
