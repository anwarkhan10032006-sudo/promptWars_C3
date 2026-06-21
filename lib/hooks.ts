import { useState, useEffect } from 'react';

// Custom hook to animate numeric count-up and transitions smoothly
export function useAnimatedNumber(target: number, duration: number = 400): number {
  const [current, setCurrent] = useState(target);

  useEffect(() => {
    // If user prefers reduced motion, skip animation and update instantly
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(target);
      return;
    }

    let startTimestamp: number | null = null;
    const startValue = current;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing: easeOutQuad
      const easedProgress = progress * (2 - progress);
      
      const val = startValue + (target - startValue) * easedProgress;
      setCurrent(Number(val.toFixed(1)));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animFrame);
  }, [target, duration]);

  return current;
}
