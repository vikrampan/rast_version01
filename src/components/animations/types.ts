// src/components/animations/types.ts

export interface Transition {
    duration?: number;
    ease?: string | number[];
    type?: string;
    stiffness?: number;
    damping?: number;
    staggerChildren?: number;
  }
  
  export interface AnimationVariant {
    initial?: {
      [key: string]: any;
      transition?: Transition;
    };
    animate?: {
      [key: string]: any;
      transition?: Transition;
    };
    exit?: {
      [key: string]: any;
      transition?: Transition;
    };
    hover?: {
      [key: string]: any;
      transition?: Transition;
    };
    tap?: {
      [key: string]: any;
      transition?: Transition;
    };
    rest?: {
      [key: string]: any;
      transition?: Transition;
    };
  }
  
  export interface VariantProps {
    variants: AnimationVariant;
    initial?: string | boolean;
    animate?: string | boolean;
    exit?: string | boolean;
    whileHover?: string;
    whileTap?: string;
  }