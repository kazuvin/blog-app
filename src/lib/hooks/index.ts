// Animation Hooks
// Inspired by Framer Motion's design patterns for composable, reusable animations

export {
  type AnimationControls,
  type AnimationOptions,
  type AnimationState,
  useAnimation,
} from "./use-animation";
export {
  type AnimationFrameControls,
  type AnimationFrameInfo,
  type UseAnimationFrameOptions,
  useAnimationFrame,
} from "./use-animation-frame";
export { type UseInViewOptions, type UseInViewResult, useInView } from "./use-in-view";
export { useReducedMotion } from "./use-reduced-motion";
export {
  type SpringConfig,
  SpringPresets,
  type SpringValue,
  useSpringValue,
} from "./use-spring-value";
