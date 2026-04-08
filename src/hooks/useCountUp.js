import { useState, useEffect } from "react";

/**
 * Animates a number from 0 to `target` with an ease-out cubic curve.
 * Returns the current count value.
 *
 * @param {number} target - Final number to count up to
 * @param {number} duration - Animation duration in ms (default 1200)
 * @param {boolean} started - Set to true to begin the animation
 */
export function useCountUp(target, duration = 1200, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = null;
    let frameId = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) frameId = requestAnimationFrame(step);
      else setCount(target);
    };
    frameId = requestAnimationFrame(step);
    return () => { if (frameId) cancelAnimationFrame(frameId); };
  }, [started, target, duration]);
  return count;
}
