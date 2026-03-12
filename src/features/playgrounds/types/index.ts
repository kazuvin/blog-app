import type { ComponentType } from "react";

export type PlaygroundItem = {
  slug: string;
  name: string;
  description: string;
  component?: ComponentType;
};
