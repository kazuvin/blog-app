"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";
import { LoadingSpinnerIcon } from "@/components/icons";
import { EASE_DEFAULT } from "@/lib/animation";
import { cn } from "@/lib/utils";

/**
 * Native button event names whose React types collide with motion's drag /
 * animation handler types when spread onto `motion.button`. Buttons rarely
 * expose these handlers, so we omit them from the public API.
 */
type ConflictingMotionEventNames =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragLeave"
  | "onDragOver"
  | "onDragExit"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration";

// ============================================================================
// Types
// ============================================================================

/** The possible states of a stateful button */
export type ButtonState = "idle" | "loading" | "success" | "error";

/** Props for the Button component */
export type ButtonProps = Omit<
  ComponentProps<"button">,
  "children" | ConflictingMotionEventNames
> & {
  /** Current state of the button */
  state?: ButtonState;
  /** Visual variant of the button */
  variant?: "primary" | "secondary" | "ghost";
  /** Size of the button */
  size?: "sm" | "md" | "lg";
  /** Text displayed in idle state */
  idleText?: string;
  /** Text displayed in loading state */
  loadingText?: string;
  /** Text displayed in success state */
  successText?: string;
  /** Text displayed in error state */
  errorText?: string;
};

/** Common props for icon components */
type IconProps = {
  className?: string;
};

// ============================================================================
// Constants
// ============================================================================

/** Base styles applied to all button variants */
const baseStyles = [
  "inline-flex items-center justify-center font-medium",
  "transition-colors duration-300 ease-default",
  "focus:outline-none focus:ring-2 focus:ring-offset-2",
  "disabled:cursor-not-allowed disabled:opacity-50",
] as const;

/** Styles for each button variant in idle state */
const variantStyles = {
  primary: "bg-foreground text-background hover:opacity-90 focus:ring-foreground",
  secondary:
    "bg-transparent text-foreground border border-foreground/20 hover:bg-foreground/5 focus:ring-foreground",
  ghost: "bg-transparent text-foreground hover:bg-foreground/10 focus:ring-foreground",
} as const;

/** Styles for each button variant in loading state */
const loadingStyles = {
  primary: "bg-foreground/80 text-background focus:ring-foreground",
  secondary: "bg-foreground/5 text-foreground border border-foreground/20 focus:ring-foreground",
  ghost: "bg-foreground/5 text-foreground focus:ring-foreground",
} as const;

/**
 * Styles for success state.
 *
 * `transition-none` で baseStyles の `transition-colors` を打ち消す。
 * loading の `bg-foreground/80`（暗色 + 80% alpha）から success の vivid green への
 * OKLCH 補間は途中で低明度の中間点を通り、一瞬黒く見えるため snap させる。
 */
const successStyles =
  "bg-success text-white hover:bg-success focus:ring-success border-transparent transition-none";

/** Styles for error state — see successStyles for the snap rationale. */
const errorStyles =
  "bg-error text-white hover:bg-error focus:ring-error border-transparent transition-none";

/** Styles for each button size */
const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm font-semibold",
  lg: "px-6 py-3 text-lg",
} as const;

// ============================================================================
// Icon Components
// ============================================================================

/** Check icon for success state with optional draw animation */
function CheckIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
        style={{
          strokeDasharray: 24,
          strokeDashoffset: 24,
          animation: "draw 0.3s ease forwards 0.15s",
        }}
      />
    </svg>
  );
}

/** X icon for error state */
function XIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ============================================================================
// Icon Resolver
// ============================================================================

function renderStateIcon(state: ButtonState) {
  switch (state) {
    case "loading":
      return <LoadingSpinnerIcon className="h-4 w-4" />;
    case "success":
      return <CheckIcon className="h-4 w-4 animate-check-bounce" />;
    case "error":
      return <XIcon className="h-4 w-4 animate-shake" />;
    default:
      return null;
  }
}

// ============================================================================
// Main Component
// ============================================================================

const TRANSITION_DURATION = 0.3;
/**
 * `motion` の layout animation は親要素の transform: scale で width 補間するため、
 * `rounded-full`（class）だけだと scale 中に楕円化する。
 * inline style に数値で渡すと motion が scale 補正をかけて常に円形を保つ。
 */
const PILL_RADIUS = 9999;

/**
 * A button component that displays different states with smooth animations.
 * Supports idle, loading, success, and error states with corresponding icons and text.
 */
export function Button({
  state = "idle",
  variant = "primary",
  size = "md",
  idleText = "Submit",
  loadingText = "Loading...",
  successText = "Success!",
  errorText = "Error!",
  className,
  disabled,
  ...props
}: ButtonProps) {
  const reduce = useReducedMotion();
  const isDisabled = disabled || state === "loading";
  const hasIcon = state !== "idle";

  const texts: Record<ButtonState, string> = {
    idle: idleText,
    loading: loadingText,
    success: successText,
    error: errorText,
  };

  const transition = reduce
    ? { duration: 0 }
    : { duration: TRANSITION_DURATION, ease: EASE_DEFAULT };

  return (
    <motion.button
      layout
      transition={transition}
      style={{ borderRadius: PILL_RADIUS }}
      className={cn(
        baseStyles,
        hasIcon ? "gap-2" : "gap-0",
        sizeStyles[size],
        state === "idle" && variantStyles[variant],
        state === "loading" && loadingStyles[variant],
        state === "success" && successStyles,
        state === "error" && errorStyles,
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {hasIcon ? (
          <motion.span
            key={state}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            className="inline-flex items-center justify-center"
          >
            {renderStateIcon(state)}
          </motion.span>
        ) : null}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={state}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
          className="whitespace-nowrap"
        >
          {texts[state]}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
