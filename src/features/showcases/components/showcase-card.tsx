"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { useInView } from "@/lib/animation";
import { cn } from "@/lib/utils";

export type ShowcaseCardProps = {
  name: string;
  description: string;
  preview: ReactNode;
  onClick: () => void;
};

export function ShowcaseCard({ name, description, preview, onClick }: ShowcaseCardProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "-250px",
    threshold: 0,
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: Using div with role="button" to avoid nested button elements when preview contains Button components
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="cursor-pointer text-left"
    >
      <Card className="h-full overflow-hidden transition-colors hover:border-foreground/30">
        <CardHeader>
          <h2 className="font-semibold text-lg">{name}</h2>
          <p className="text-foreground/60 text-sm">{description}</p>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "flex min-h-[80px] items-center justify-center rounded-md bg-surface p-4",
              inView ? "animate-fade-in-up" : "opacity-0"
            )}
          >
            {preview}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
