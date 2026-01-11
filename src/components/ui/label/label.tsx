import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type LabelProps = ComponentProps<"label"> & {
  required?: boolean;
};

export function Label({
  required = false,
  className,
  children,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        "text-sm font-medium text-foreground",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}
