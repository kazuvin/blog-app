"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
  useId,
  useMemo,
} from "react";
import { EASE_SPRING } from "@/lib/animation";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

/** Visual variant of the tab nav */
export type TabNavVariant = "primary" | "secondary" | "ghost";

/** Size of the tab nav */
export type TabNavSize = "sm" | "md" | "lg";

/** Props for the TabNav component */
export type TabNavProps = Omit<ComponentProps<"div">, "onChange"> & {
  /** Currently selected value */
  value: string;
  /** Callback when selection changes */
  onValueChange: (value: string) => void;
  /** Visual variant of the tab nav */
  variant?: TabNavVariant;
  /** Size of the tab nav */
  size?: TabNavSize;
  /** Children (TabNavItem components) */
  children: ReactNode;
};

/** Props for the TabNav.Item component */
export type TabNavItemProps = Omit<ComponentProps<"button">, "value"> & {
  /** Unique value for this item */
  value: string;
  /** Content of the item */
  children: ReactNode;
};

/** Internal context for TabNav */
type TabNavContextValue = {
  selectedValue: string;
  onSelect: (value: string) => void;
  variant: TabNavVariant;
  size: TabNavSize;
  /** Stable id used as motion layoutId so multiple TabNav instances do not clash */
  indicatorLayoutId: string;
  reduceMotion: boolean;
};

// ============================================================================
// Constants
// ============================================================================

/** Base styles for the tab nav container */
const containerBaseStyles = [
  "relative inline-flex items-center gap-1 rounded-full p-1",
  "bg-foreground/5",
] as const;

/** Indicator styles for each variant */
const indicatorVariantStyles = {
  primary: "bg-foreground",
  secondary: "bg-foreground/10 border border-foreground/20",
  ghost: "bg-foreground/10",
} as const;

/** Base styles for button items */
const itemBaseStyles = [
  "relative inline-flex items-center justify-center rounded-full font-medium",
  "transition-colors duration-200 ease-default",
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2",
  "disabled:cursor-not-allowed disabled:opacity-50",
] as const;

/** Item text styles for each variant when selected */
const itemSelectedStyles = {
  primary: "text-background",
  secondary: "text-foreground",
  ghost: "text-foreground",
} as const;

/** Item text styles for each variant when not selected */
const itemUnselectedStyles = {
  primary: "text-foreground/70 hover:text-foreground",
  secondary: "text-foreground/70 hover:text-foreground",
  ghost: "text-foreground/70 hover:text-foreground",
} as const;

/** Size styles for items */
const itemSizeStyles = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-1.5 text-sm",
  lg: "px-5 py-2 text-base",
} as const;

const INDICATOR_DURATION = 0.3;

// ============================================================================
// Context
// ============================================================================

const TabNavContext = createContext<TabNavContextValue | null>(null);

function useTabNavContext() {
  const context = useContext(TabNavContext);
  if (!context) {
    throw new Error("TabNavItem must be used within a TabNav");
  }
  return context;
}

// ============================================================================
// TabNavItem Component
// ============================================================================

export function TabNavItem({ value, children, className, disabled, ...props }: TabNavItemProps) {
  const { selectedValue, onSelect, variant, size, indicatorLayoutId, reduceMotion } =
    useTabNavContext();
  const isSelected = selectedValue === value;

  const handleClick = () => {
    if (!disabled) {
      onSelect(value);
    }
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        itemBaseStyles,
        itemSizeStyles[size],
        isSelected ? itemSelectedStyles[variant] : itemUnselectedStyles[variant],
        className
      )}
      {...props}
    >
      {isSelected ? (
        <motion.span
          layoutId={indicatorLayoutId}
          transition={
            reduceMotion ? { duration: 0 } : { duration: INDICATOR_DURATION, ease: EASE_SPRING }
          }
          aria-hidden="true"
          className={cn("absolute inset-0 -z-10 rounded-full", indicatorVariantStyles[variant])}
        />
      ) : null}
      <span className="relative">{children}</span>
    </button>
  );
}

// ============================================================================
// TabNav Component
// ============================================================================

/**
 * A tab navigation component with an animated sliding indicator.
 * Supports multiple visual variants and sizes.
 *
 * @example
 * ```tsx
 * <TabNav value={selected} onValueChange={setSelected}>
 *   <TabNavItem value="tab1">Tab 1</TabNavItem>
 *   <TabNavItem value="tab2">Tab 2</TabNavItem>
 *   <TabNavItem value="tab3">Tab 3</TabNavItem>
 * </TabNav>
 * ```
 */
function TabNavRoot({
  value,
  onValueChange,
  variant = "primary",
  size = "md",
  children,
  className,
  ...props
}: TabNavProps) {
  const indicatorLayoutId = useId();
  const reduceMotion = useReducedMotion() ?? false;

  const contextValue = useMemo<TabNavContextValue>(
    () => ({
      selectedValue: value,
      onSelect: onValueChange,
      variant,
      size,
      indicatorLayoutId,
      reduceMotion,
    }),
    [value, onValueChange, variant, size, indicatorLayoutId, reduceMotion]
  );

  return (
    <TabNavContext.Provider value={contextValue}>
      <div role="tablist" className={cn(containerBaseStyles, className)} {...props}>
        {children}
      </div>
    </TabNavContext.Provider>
  );
}

// ============================================================================
// Export
// ============================================================================

export { TabNavRoot as TabNav };
