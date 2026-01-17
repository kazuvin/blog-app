"use client";

import { useCallback, useEffect, useRef } from "react";

export interface AnimationFrameInfo {
  /**
   * Elapsed time since the animation started in milliseconds
   */
  time: number;

  /**
   * Time since the last frame in milliseconds
   */
  delta: number;
}

export interface UseAnimationFrameOptions {
  /**
   * Whether the animation loop should start automatically
   * @default true
   */
  autoStart?: boolean;
}

export interface AnimationFrameControls {
  /**
   * Start the animation loop
   */
  start: () => void;

  /**
   * Stop the animation loop
   */
  stop: () => void;

  /**
   * Whether the animation loop is currently running
   */
  isRunning: boolean;
}

/**
 * Executes a callback on every animation frame using requestAnimationFrame.
 *
 * Inspired by Framer Motion's useAnimationFrame, this hook provides
 * precise timing information for custom animations.
 *
 * @param callback - Function to call on each frame with timing info
 * @param options - Configuration options
 * @returns Controls to start/stop the animation loop
 *
 * @example
 * ```tsx
 * function RotatingElement() {
 *   const [rotation, setRotation] = useState(0);
 *
 *   useAnimationFrame(({ time }) => {
 *     // Rotate at 90 degrees per second
 *     setRotation((time / 1000) * 90);
 *   });
 *
 *   return (
 *     <div style={{ transform: `rotate(${rotation}deg)` }}>
 *       Spinning
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Manual control
 * function PausableAnimation() {
 *   const [position, setPosition] = useState(0);
 *   const controls = useAnimationFrame(
 *     ({ delta }) => {
 *       setPosition(prev => prev + delta * 0.1);
 *     },
 *     { autoStart: false }
 *   );
 *
 *   return (
 *     <div>
 *       <div style={{ transform: `translateX(${position}px)` }}>
 *         Moving element
 *       </div>
 *       <button onClick={controls.isRunning ? controls.stop : controls.start}>
 *         {controls.isRunning ? 'Pause' : 'Play'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAnimationFrame(
  callback: (info: AnimationFrameInfo) => void,
  options: UseAnimationFrameOptions = {}
): AnimationFrameControls {
  const { autoStart = true } = options;

  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);
  const isRunningRef = useRef(false);

  // Update callback ref on each render to always have the latest callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const animate = useCallback((timestamp: number) => {
    if (!isRunningRef.current) return;

    // Initialize start time on first frame
    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp;
      lastTimeRef.current = timestamp;
    }

    const time = timestamp - startTimeRef.current;
    const delta = timestamp - (lastTimeRef.current || timestamp);
    lastTimeRef.current = timestamp;

    callbackRef.current({ time, delta });

    frameRef.current = requestAnimationFrame(animate);
  }, []);

  const start = useCallback(() => {
    if (isRunningRef.current) return;

    isRunningRef.current = true;
    startTimeRef.current = null;
    lastTimeRef.current = null;
    frameRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const stop = useCallback(() => {
    isRunningRef.current = false;

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  // Auto-start and cleanup
  useEffect(() => {
    if (autoStart) {
      start();
    }

    return () => {
      stop();
    };
  }, [autoStart, start, stop]);

  return {
    start,
    stop,
    isRunning: isRunningRef.current,
  };
}
