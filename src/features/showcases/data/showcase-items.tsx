import type { ShowcaseItem } from "../types";
import { ButtonFullDemo, ButtonPreview } from "./stateful-button-demo";
import { TabNavFullDemo, TabNavPreview } from "./tab-nav-demo";

export const showcaseItems: ShowcaseItem[] = [
  {
    id: "stateful-button",
    name: "Stateful Button",
    description:
      "Button component with seamless state transitions (idle, loading, success, error) and smooth animations.",
    preview: <ButtonPreview />,
    fullDemo: <ButtonFullDemo />,
  },
  {
    id: "tab-nav",
    name: "Tab Nav",
    description: "Animated tab navigation with sliding indicator",
    preview: <TabNavPreview />,
    fullDemo: <TabNavFullDemo />,
  },
];
