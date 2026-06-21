'use client';

import React, { useState } from 'react';
import { Slider } from '../../components/ui/slider';
import { ImpactStoryCard } from '../../components/storytelling/impact-story-card';
import { motion } from 'framer-motion';
import { Sliders, Car, Zap, Apple } from 'lucide-react';
import { UserProfile } from '../../types';

export function SimulatorClient({ profile }: { profile: UserProfile }) {
  // Scenario values
  const [reduceDriveKm, setReduceDriveKm] = useState(0); // 0 to 500 km/month
  const [reduceElecKwh, setReduceElecKwh] = useState(0); // 0 to 300 kWh/month
  const [vegDays, setVegDays] = useState(0); // 0 to 30 days/month

  // Multipliers based on standard factors
  const DRIVING_EMISSION_FACTOR = 0.18; // kg CO2e per km saved
  const ELEC_EMISSION_FACTOR = 0.35;    // kg CO2e per kWh saved
  const VEG_DAY_SAVINGS = 4.5;          // kg CO2e saved per day swapping meat to veg

  const driveSavings = reduceDriveKm * DRIVING_EMISSION_FACTOR;
  const elecSavings = reduceElecKwh * ELEC_EMISSION_FACTOR;
  const foodSavings = vegDays * VEG_DAY_SAVINGS;

  const totalSavings = driveSavings + elecSavings + foodSavings;

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface border border-border p-6 rounded-2xl shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
            Impact Simulator
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Sandbox mode for {profile.full_name || 'Eco User'}: move the sliders below to see how small daily changes compound into massive monthly carbon savings.
          </p>
        </div>
        <div className="p-3 bg-accent/10 rounded-xl text-accent">
          <Sliders className="h-6 w-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders Column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Transportation */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-category-transportation/10 text-category-transportation rounded-lg">
                  <Car className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary">Drive Less</h3>
                  <p className="text-xs text-text-secondary">Replace petrol car trips with biking, walking, or transit.</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block font-bold text-lg font-tabular">{reduceDriveKm} km</span>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Per Month</span>
              </div>
            </div>
            <Slider
              value={reduceDriveKm}
              max={500}
              step={10}
              onChange={(val) => setReduceDriveKm(val)}
              className="mt-6"
            />
          </div>

          {/* Electricity */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-category-electricity/10 text-category-electricity rounded-lg">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary">Save Electricity</h3>
                  <p className="text-xs text-text-secondary">Reduce phantom loads or improve HVAC efficiency.</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block font-bold text-lg font-tabular">{reduceElecKwh} kWh</span>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Per Month</span>
              </div>
            </div>
            <Slider
              value={reduceElecKwh}
              max={300}
              step={10}
              onChange={(val) => setReduceElecKwh(val)}
              className="mt-6"
            />
          </div>

          {/* Food */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-category-food/10 text-category-food rounded-lg">
                  <Apple className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary">Eat Plant-Based</h3>
                  <p className="text-xs text-text-secondary">Swap meat-heavy meals for vegetarian options.</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block font-bold text-lg font-tabular">{vegDays} days</span>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Per Month</span>
              </div>
            </div>
            <Slider
              value={vegDays}
              max={30}
              step={1}
              onChange={(val) => setVegDays(val)}
              className="mt-6"
            />
          </div>

        </div>

        {/* Real-time Impact visualization */}
        <div className="lg:col-span-5 sticky top-24">
          <motion.div 
            className="bg-primary text-primary-foreground p-6 rounded-t-2xl shadow-md border-b border-white/10"
            animate={{ scale: totalSavings > 0 ? 1.02 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <h3 className="text-xs uppercase font-bold tracking-widest opacity-80 mb-2">Simulated Monthly Savings</h3>
            <div className="text-6xl font-extrabold font-tabular tracking-tight">
              -{totalSavings.toFixed(1)}
            </div>
            <p className="text-sm font-semibold opacity-90 mt-1">kg CO2e avoided</p>
          </motion.div>
          
          <div className="rounded-b-2xl shadow-md overflow-hidden bg-surface">
            {totalSavings > 0 ? (
              <ImpactStoryCard
                kgco2e={totalSavings}
                label="If you commit to this..."
                preferredType={totalSavings > 100 ? 'tree_year_absorption' : 'smartphone_charge'}
                className="rounded-none border-0 shadow-none bg-surface"
              />
            ) : (
              <div className="p-8 text-center text-text-muted">
                <p className="text-sm">Move the sliders to project your impact equivalents.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
