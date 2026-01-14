import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui";

export type ShowcaseCardProps = {
  name: string;
  description: string;
  preview: ReactNode;
  onClick: () => void;
};

export function ShowcaseCard({ name, description, preview, onClick }: ShowcaseCardProps) {
  return (
    <button onClick={onClick} className="text-left" type="button">
      <Card className="h-full transition-colors hover:border-foreground/30">
        <CardHeader>
          <h2 className="font-semibold text-lg">{name}</h2>
          <p className="text-foreground/60 text-sm">{description}</p>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[80px] items-center justify-center rounded-md bg-surface p-4">
            {preview}
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
