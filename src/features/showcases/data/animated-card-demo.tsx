"use client";

import { Card, CardContent, CardHeader } from "@/components/ui";
import { useInView } from "@/lib/animation";
import { cn } from "@/lib/utils";

/**
 * Preview component for the animated card showcase item.
 * Shows a static card with a fade-in animation hint.
 */
export function AnimatedCardPreview() {
  return (
    <Card className="w-full max-w-xs">
      <CardContent className="py-3">
        <p className="text-sm">Scroll to see animation</p>
      </CardContent>
    </Card>
  );
}

/**
 * Single animated card that fades in and slides up when entering the viewport.
 */
function FadeInCard({
  title,
  description,
  delay = 0,
}: {
  title: string;
  description: string;
  delay?: number;
}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "-50px",
    threshold: 0.1,
  });

  return (
    <Card
      ref={ref}
      className={cn(inView ? "animate-fade-in-up" : "opacity-0")}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader>
        <h3 className="font-semibold">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/70 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

/**
 * Full demo component for the animated card showcase.
 * Creates a scrollable area with multiple cards that animate when entering the viewport.
 */
export function AnimatedCardFullDemo() {
  const cards = [
    {
      title: "First Card",
      description:
        "This card fades in and slides up when it enters the viewport. Scroll down to see more cards animate.",
    },
    {
      title: "Second Card",
      description:
        "Each card uses the useInView hook with triggerOnce: true, so the animation only plays once.",
    },
    {
      title: "Third Card",
      description:
        "The rootMargin is set to -50px, which means the animation triggers slightly before the card is fully visible.",
    },
    {
      title: "Fourth Card",
      description:
        "CSS transitions handle the animation with translateY and opacity changes over 500ms with ease-out timing.",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 font-medium text-sm">Scroll to Reveal Animation</h4>
        <p className="mb-4 text-foreground/70 text-sm">
          Scroll within this container to see cards animate into view. Each card fades in from below
          with a smooth transition.
        </p>
      </div>

      <div className="h-[400px] space-y-6 overflow-y-auto rounded-lg border border-stone-200 p-4">
        {/* Spacer to enable scrolling */}
        <div className="flex h-[100px] items-center justify-center text-foreground/50 text-sm">
          Scroll down to see the animation
        </div>

        {cards.map((card, index) => (
          <FadeInCard
            key={card.title}
            title={card.title}
            description={card.description}
            delay={index * 100}
          />
        ))}

        {/* Bottom spacer */}
        <div className="h-[50px]" />
      </div>

      <div>
        <h4 className="mb-3 font-medium text-sm">Implementation Details</h4>
        <ul className="list-inside list-disc space-y-1 text-foreground/70 text-sm">
          <li>Uses the useInView hook with Intersection Observer API</li>
          <li>triggerOnce: true ensures animation plays only once</li>
          <li>rootMargin: -50px triggers animation slightly before entering viewport</li>
          <li>CSS transition: 500ms ease-out for smooth animation</li>
          <li>Transform: translateY(30px) to translateY(0) for slide-up effect</li>
          <li>Opacity: 0 to 1 for fade-in effect</li>
        </ul>
      </div>
    </div>
  );
}
