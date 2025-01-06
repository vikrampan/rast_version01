// src/components/animations/types.ts

export interface Transition {
  duration?: number;
  ease?: string | number[];
  type?: string;
  stiffness?: number;
  damping?: number;
  staggerChildren?: number;
  delay?: number; // Added delay property
}

type AnimationValue = number | string | boolean;

interface AnimationProperties {
  x?: AnimationValue;
  y?: AnimationValue;
  scale?: AnimationValue;
  rotate?: AnimationValue;
  opacity?: AnimationValue;
  backgroundColor?: string;
  color?: string;
  width?: AnimationValue;
  height?: AnimationValue;
  transition?: Transition;
  transformOrigin?: string;
  transform?: string;
  perspective?: number;
  [key: string]: AnimationValue | Transition | undefined;
}

export interface AnimationVariant {
  initial?: AnimationProperties;
  animate?: AnimationProperties;
  exit?: AnimationProperties;
  hover?: AnimationProperties;
  tap?: AnimationProperties;
  rest?: AnimationProperties;
  transition?: Transition; // Added top-level transition
}