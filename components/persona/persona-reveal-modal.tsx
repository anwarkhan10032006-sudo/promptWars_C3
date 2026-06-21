'use client';

import React, { useState, useEffect } from 'react';
import { PersonaKey } from '../../types';
import { PERSONA_METADATA } from '../../lib/persona';
import { Dialog } from '../ui/dialog';
import { PersonaCard } from './persona-card';
import { motion } from 'framer-motion';
import { Sparkles, Trophy } from 'lucide-react';
import { Button } from '../ui/button';

interface PersonaRevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  personaKey: PersonaKey;
  isEvolution?: boolean; // If true, show "Persona Evolved!" instead of "Persona Revealed!"
  reasonText?: string;
}

export function PersonaRevealModal({ isOpen, onClose, personaKey, isEvolution = false, reasonText }: PersonaRevealModalProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const meta = PERSONA_METADATA[personaKey];

  useEffect(() => {
    if (isOpen) {
      // Auto flip after 1 second for visual suspense
      const timer = setTimeout(() => {
        setIsFlipped(true);
      }, 1000);
      return () => {
        clearTimeout(timer);
        setIsFlipped(false);
      };
    }
  }, [isOpen]);

  if (!meta) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="">
      <div className="flex flex-col items-center justify-center p-2 text-center overflow-hidden">
        {/* Animated Celebration Banner */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex flex-col items-center space-y-2 mb-6"
        >
          <div className="p-3 bg-primary/10 text-primary rounded-full">
            {isEvolution ? <Trophy className="h-8 w-8" /> : <Sparkles className="h-8 w-8" />}
          </div>
          <h2 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
            {isEvolution ? 'Your Persona Evolved!' : 'Your Baseline Persona'}
          </h2>
          <p className="text-xs text-text-secondary max-w-xs">
            {isEvolution 
              ? reasonText || 'Your footprint shifts have unlocked a new classification.'
              : 'Based on your onboarding responses, we classified your carbon habits.'}
          </p>
        </motion.div>

        {/* 3D Flip Card Container */}
        <div className="w-full max-w-sm h-[380px] perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
          <motion.div
            className="w-full h-full relative preserve-3d"
            animate={{ rotateY: isFlipped ? 0 : 180 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          >
            {/* CARD BACK: Face Down (Unrevealed) */}
            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-primary to-emerald-800 border border-emerald-950 p-6 rounded-2xl flex flex-col items-center justify-center text-white shadow-md rotate-y-180">
              <Sparkles className="h-16 w-16 text-emerald-300 animate-pulse" />
              <h3 className="text-xl font-bold font-display mt-4">Unlocking Persona...</h3>
              <p className="text-xs text-emerald-100/70 mt-2 text-center max-w-[200px]">Click card or wait to reveal your profile</p>
            </div>

            {/* CARD FRONT: Revealed Persona Card */}
            <div className="absolute inset-0 backface-hidden">
              <PersonaCard 
                personaKey={personaKey} 
                showDetails={true}
                className="w-full h-full border-2 border-primary/20 shadow-md"
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 w-full"
          >
            <Button onClick={onClose} variant="primary" className="w-full">
              {isEvolution ? 'Awesome, Got it!' : 'Continue to Dashboard'}
            </Button>
          </motion.div>
        )}
      </div>
      
      {/* 3D Perspective CSS helpers */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </Dialog>
  );
}
