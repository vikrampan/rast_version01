// src/components/animations/index.ts

import { AnimationVariant, Transition } from './types';

export * from './variants';
export * from './types';

// Utility functions for animations
export const combineVariants = (...variants: AnimationVariant[]): AnimationVariant => {
  return variants.reduce((combined, current) => ({
    ...combined,
    ...current,
    animate: {
      ...combined?.animate,
      ...current?.animate,
    },
    ...(combined?.transition || current?.transition ? {
      transition: {
        ...(combined?.transition || {}),
        ...(current?.transition || {})
      }
    } : {})
  }), {} as AnimationVariant);
};

export const withDelay = (variant: AnimationVariant, delayTime: number): AnimationVariant => {
  return {
    ...variant,
    animate: {
      ...variant.animate,
      transition: {
        ...variant.animate?.transition,
        delay: delayTime
      }
    }
  };
};

export const withCustomTransition = (
  variant: AnimationVariant, 
  customTransition: Partial<Transition>
): AnimationVariant => {
  return {
    ...variant,
    animate: {
      ...variant.animate,
      transition: {
        ...variant.animate?.transition,
        ...customTransition
      }
    }
  };
};