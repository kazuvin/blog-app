import type { ReactNode } from "react";

export type ShowcaseItem = {
  id: string;
  name: string;
  description: string;
  preview: ReactNode;
  fullDemo: ReactNode;
};
