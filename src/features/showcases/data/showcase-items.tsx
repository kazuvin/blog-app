import type { ShowcaseItem } from "../types";
import { StatefulButtonFullDemo, StatefulButtonPreview } from "./stateful-button-demo";

export const showcaseItems: ShowcaseItem[] = [
  {
    id: "stateful-button",
    name: "Stateful Button",
    description:
      "Button component with seamless state transitions (idle, loading, success, error) and smooth animations.",
    preview: <StatefulButtonPreview />,
    fullDemo: <StatefulButtonFullDemo />,
  },
];
