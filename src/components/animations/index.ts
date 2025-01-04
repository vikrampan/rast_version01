// src/components/animations/index.ts

export * from './variants';
export * from './types';

// Utility functions for animations
export const combineVariants = (...variants: any[]) => {
  return variants.reduce((combined, current) => ({
    ...combined,
    ...current,
    animate: {
      ...combined?.animate,
      ...current?.animate,
    },
    transition: {
      ...combined?.transition,
      ...current?.transition,
    },
  }), {});
};

export const withDelay = (variant: any, delay: number) => {
  return {
    ...variant,
    animate: {
      ...variant.animate,
      transition: {
        ...variant.animate?.transition,
        delay,
      },
    },
  };
};

export const withCustomTransition = (variant: any, customTransition: any) => {
  return {
    ...variant,
    animate: {
      ...variant.animate,
      transition: {
        ...variant.animate?.transition,
        ...customTransition,
      },
    },
  };
};