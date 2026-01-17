import { Badge, Button, Card, CardContent, CardHeader, Input, Label } from "@/components/ui";
import type { ShowcaseItem } from "../types";
import { AnimatedCardFullDemo, AnimatedCardPreview } from "./animated-card-demo";

export const showcaseItems: ShowcaseItem[] = [
  {
    id: "button",
    name: "Button",
    description: "Interactive button component with multiple variants and sizes.",
    preview: (
      <div className="flex flex-wrap gap-2">
        <Button size="sm">Primary</Button>
        <Button variant="secondary" size="sm">
          Secondary
        </Button>
        <Button variant="ghost" size="sm">
          Ghost
        </Button>
      </div>
    ),
    fullDemo: (
      <div className="space-y-6">
        <div>
          <h4 className="mb-3 font-medium text-sm">Variants</h4>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-medium text-sm">Sizes</h4>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-medium text-sm">Disabled</h4>
          <div className="flex flex-wrap gap-3">
            <Button disabled>Disabled Primary</Button>
            <Button variant="secondary" disabled>
              Disabled Secondary
            </Button>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "badge",
    name: "Badge",
    description: "Status indicator badges with semantic variants.",
    preview: (
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="error">Error</Badge>
      </div>
    ),
    fullDemo: (
      <div className="space-y-6">
        <div>
          <h4 className="mb-3 font-medium text-sm">Variants</h4>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-medium text-sm">Sizes</h4>
          <div className="flex flex-wrap items-center gap-3">
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "input",
    name: "Input",
    description: "Text input field with validation states and sizes.",
    preview: (
      <div className="w-full max-w-xs space-y-2">
        <Input placeholder="Enter text..." inputSize="sm" />
      </div>
    ),
    fullDemo: (
      <div className="space-y-6">
        <div>
          <h4 className="mb-3 font-medium text-sm">Variants</h4>
          <div className="space-y-3">
            <Input placeholder="Default input" variant="default" />
            <Input placeholder="Error input" variant="error" />
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-medium text-sm">Sizes</h4>
          <div className="space-y-3">
            <Input placeholder="Small" inputSize="sm" />
            <Input placeholder="Medium" inputSize="md" />
            <Input placeholder="Large" inputSize="lg" />
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-medium text-sm">With Label</h4>
          <div className="space-y-2">
            <Label htmlFor="demo-input">Email Address</Label>
            <Input id="demo-input" type="email" placeholder="you@example.com" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "card",
    name: "Card",
    description: "Container component for grouping related content.",
    preview: (
      <Card className="w-full max-w-xs">
        <CardContent className="py-3">
          <p className="text-sm">Card content preview</p>
        </CardContent>
      </Card>
    ),
    fullDemo: (
      <div className="space-y-6">
        <div>
          <h4 className="mb-3 font-medium text-sm">Default Variant</h4>
          <Card variant="default">
            <CardHeader>
              <h3 className="font-semibold">Card Title</h3>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70 text-sm">
                This is the card content. Cards can contain any type of content including text,
                images, and other components.
              </p>
            </CardContent>
          </Card>
        </div>
        <div>
          <h4 className="mb-3 font-medium text-sm">Outline Variant</h4>
          <Card variant="outline">
            <CardHeader>
              <h3 className="font-semibold">Outline Card</h3>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70 text-sm">A more subtle card style with outline.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: "label",
    name: "Label",
    description: "Form label component for input fields.",
    preview: (
      <div className="space-y-1">
        <Label>Form Label</Label>
      </div>
    ),
    fullDemo: (
      <div className="space-y-6">
        <div>
          <h4 className="mb-3 font-medium text-sm">Basic Label</h4>
          <Label>Username</Label>
        </div>
        <div>
          <h4 className="mb-3 font-medium text-sm">With Input</h4>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Enter username" />
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-medium text-sm">Required Field</h4>
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "animated-card",
    name: "Animated Card",
    description: "Card component with fade-in and slide-up animation triggered by scroll.",
    preview: <AnimatedCardPreview />,
    fullDemo: <AnimatedCardFullDemo />,
  },
];
