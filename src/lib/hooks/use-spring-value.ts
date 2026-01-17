"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface SpringConfig {
  /**
   * Stiffness of the spring (higher = faster)
   * @default 100
   */
  stiffness?: number;

  /**
   * Damping ratio (higher = less oscillation)
   * @default 10
   */
  damping?: number;

  /**
   * Mass of the spring (higher = slower, more momentum)
   * @default 1
   */
  mass?: number;

  /**
   * Velocity threshold to consider the animation complete
   * @default 0.01
   */
  velocityThreshold?: number;

  /**
   * Position threshold to consider the animation complete
   * @default 0.01
   */
  positionThreshold?: number;
}

export interface SpringValue {
  /**
   * Current value of the spring
   */
  value: number;

  /**
   * Current velocity of the spring
   */
  velocity: number;

  /**
   * Whether the spring is currently animating
   */
  isAnimating: boolean;

  /**
   * Set a new target value for the spring to animate towards
   */
  set: (target: number) => void;

  /**
   * Immediately set the value without animation
   */
  jump: (value: number) => void;

  /**
   * Stop the animation at the current position
   */
  stop: () => void;
}

/**
 * Spring physics presets for common use cases
 */
export const SpringPresets = {
  /** Gentle, smooth animation */
  gentle: { stiffness: 100, damping: 15, mass: 1 },
  /** Default balanced animation */
  default: { stiffness: 100, damping: 10, mass: 1 },
  /** Bouncy animation with oscillation */
  bouncy: { stiffness: 300, damping: 10, mass: 1 },
  /** Stiff, responsive animation */
  stiff: { stiffness: 400, damping: 30, mass: 1 },
  /** Slow, heavy animation */
  slow: { stiffness: 50, damping: 20, mass: 2 },
  /** Snappy animation */
  snappy: { stiffness: 500, damping: 25, mass: 0.5 },
} as const;

const DEFAULT_CONFIG: Required<SpringConfig> = {
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocityThreshold: 0.01,
  positionThreshold: 0.01,
};

/**
 * Creates a value that animates using spring physics.
 *
 * Inspired by Framer Motion's useSpring, this hook provides smooth,
 * physics-based animations that feel natural and responsive.
 *
 * @param initialValue - The initial value of the spring
 * @param config - Spring configuration (stiffness, damping, mass)
 * @returns Spring value object with current value and control methods
 *
 * @example
 * ```tsx
 * function SpringBox() {
 *   const spring = useSpringValue(0, { stiffness: 300, damping: 20 });
 *
 *   return (
 *     <div
 *       style={{ transform: `translateX(${spring.value}px)` }}
 *       onMouseEnter={() => spring.set(100)}
 *       onMouseLeave={() => spring.set(0)}
 *     >
 *       Hover me
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Using presets
 * function BouncyButton() {
 *   const scale = useSpringValue(1, SpringPresets.bouncy);
 *
 *   return (
 *     <button
 *       style={{ transform: `scale(${scale.value})` }}
 *       onMouseDown={() => scale.set(0.9)}
 *       onMouseUp={() => scale.set(1)}
 *     >
 *       Press me
 *     </button>
 *   );
 * }
 * ```
 */
export function useSpringValue(initialValue: number, config: SpringConfig = {}): SpringValue {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const { stiffness, damping, mass, velocityThreshold, positionThreshold } = mergedConfig;

  const [value, setValue] = useState(initialValue);
  const [velocity, setVelocity] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const targetRef = useRef(initialValue);
  const valueRef = useRef(initialValue);
  const velocityRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    const now = performance.now();
    const deltaTime = lastTimeRef.current ? (now - lastTimeRef.current) / 1000 : 0.016;
    lastTimeRef.current = now;

    // Spring physics calculation
    // F = -k * x - c * v (Hooke's law with damping)
    const displacement = valueRef.current - targetRef.current;
    const springForce = -stiffness * displacement;
    const dampingForce = -damping * velocityRef.current;
    const acceleration = (springForce + dampingForce) / mass;

    // Update velocity and position using Euler integration
    velocityRef.current += acceleration * deltaTime;
    valueRef.current += velocityRef.current * deltaTime;

    setValue(valueRef.current);
    setVelocity(velocityRef.current);

    // Check if animation is complete
    const isComplete =
      Math.abs(velocityRef.current) < velocityThreshold &&
      Math.abs(displacement) < positionThreshold;

    if (isComplete) {
      // Snap to target
      valueRef.current = targetRef.current;
      velocityRef.current = 0;
      setValue(targetRef.current);
      setVelocity(0);
      setIsAnimating(false);
      lastTimeRef.current = null;
    } else {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [stiffness, damping, mass, velocityThreshold, positionThreshold]);

  const set = useCallback(
    (target: number) => {
      targetRef.current = target;

      if (!isAnimating) {
        setIsAnimating(true);
        lastTimeRef.current = null;
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    },
    [isAnimating, animate]
  );

  const jump = useCallback((newValue: number) => {
    // Cancel any ongoing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    targetRef.current = newValue;
    valueRef.current = newValue;
    velocityRef.current = 0;
    lastTimeRef.current = null;

    setValue(newValue);
    setVelocity(0);
    setIsAnimating(false);
  }, []);

  const stop = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsAnimating(false);
    lastTimeRef.current = null;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    value,
    velocity,
    isAnimating,
    set,
    jump,
    stop,
  };
}
