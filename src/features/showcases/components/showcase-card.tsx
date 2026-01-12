import { type ReactNode } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui";

export type ShowcaseCardProps = {
  name: string;
  description: string;
  preview: ReactNode;
  onClick: () => void;
};

export function ShowcaseCard({ name, description, preview, onClick }: ShowcaseCardProps) {
  return (
    <button onClick={onClick} className="text-left" type="button">
      <Card className="hover:border-foreground/30 h-full transition-colors">
        <CardHeader>
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-foreground/60 text-sm">{description}</p>
        </CardHeader>
        <CardContent>
          <div className="bg-surface flex min-h-[80px] items-center justify-center rounded-md p-4">
            {preview}
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
