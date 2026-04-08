import { useEffect } from "react";

/**
 * Singleton IntersectionObservers for scroll animations.
 * Multiple hook calls share a single observer per class,
 * preventing redundant DOM queries and duplicate observations.
 */

let animObserver = null;
let animObservedCount = 0;

let scrollObserver = null;
let scrollObservedCount = 0;

function getAnimObserver() {
  if (!animObserver) {
    animObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("vis");
        });
      },
      { threshold: 0.1 }
    );
  }
  return animObserver;
}

function getScrollObserver() {
  if (!scrollObserver) {
    scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
  }
  return scrollObserver;
}

/**
 * Observes .animate-on-scroll elements and adds .visible when they enter viewport.
 * Used by the homepage variant of scroll animations.
 */
export function useScrollAnimation() {
  useEffect(() => {
    const obs = getScrollObserver();
    const els = document.querySelectorAll(".animate-on-scroll:not(.visible)");
    els.forEach((el) => obs.observe(el));
    scrollObservedCount++;

    return () => {
      scrollObservedCount--;
      if (scrollObservedCount <= 0) {
        obs.disconnect();
        scrollObserver = null;
        scrollObservedCount = 0;
      }
    };
  }, []);
}

/**
 * Observes .anim elements and adds .vis when they enter viewport.
 * Used by all inner-page scroll animations.
 */
export function useAnim() {
  useEffect(() => {
    const obs = getAnimObserver();
    const els = document.querySelectorAll(".anim:not(.vis)");
    els.forEach((el) => obs.observe(el));
    animObservedCount++;

    return () => {
      animObservedCount--;
      if (animObservedCount <= 0) {
        obs.disconnect();
        animObserver = null;
        animObservedCount = 0;
      }
    };
  }, []);
}
