"use client";

import { useState } from "react";
import {
  Button,
  Badge,
  Input,
  Label,
  Card,
  CardHeader,
  CardContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui";
import { Container } from "@/components/ui/container";

// Showcase item type definition
type ShowcaseItem = {
  id: string;
  name: string;
  description: string;
  preview: React.ReactNode;
  fullDemo: React.ReactNode;
};

// Demo components for each showcase item
const showcaseItems: ShowcaseItem[] = [
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
          <h4 className="mb-3 text-sm font-medium">Variants</h4>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-medium">Sizes</h4>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-medium">Disabled</h4>
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
          <h4 className="mb-3 text-sm font-medium">Variants</h4>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-medium">Sizes</h4>
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
          <h4 className="mb-3 text-sm font-medium">Variants</h4>
          <div className="space-y-3">
            <Input placeholder="Default input" variant="default" />
            <Input placeholder="Error input" variant="error" />
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-medium">Sizes</h4>
          <div className="space-y-3">
            <Input placeholder="Small" inputSize="sm" />
            <Input placeholder="Medium" inputSize="md" />
            <Input placeholder="Large" inputSize="lg" />
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-medium">With Label</h4>
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
          <h4 className="mb-3 text-sm font-medium">Default Variant</h4>
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
          <h4 className="mb-3 text-sm font-medium">Outline Variant</h4>
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
          <h4 className="mb-3 text-sm font-medium">Basic Label</h4>
          <Label>Username</Label>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-medium">With Input</h4>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Enter username" />
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-medium">Required Field</h4>
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
];

export default function ShowcasesPage() {
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);

  return (
    <Container>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2 text-3xl font-bold">Component Showcases</h1>
          <p className="text-foreground/70">
            A collection of presentation components for verification and testing purposes.
          </p>
        </div>

        {/* Grid of showcase cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {showcaseItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="text-left"
              type="button"
            >
              <Card className="hover:border-foreground/30 h-full transition-colors">
                <CardHeader>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-foreground/60 text-sm">{item.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="bg-surface flex min-h-[80px] items-center justify-center rounded-md p-4">
                    {item.preview}
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>

        {/* Single dialog for component preview - performance optimized */}
        <Dialog open={selectedItem !== null} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent size="lg">
            <DialogHeader>
              <DialogTitle>{selectedItem?.name}</DialogTitle>
              <DialogDescription>{selectedItem?.description}</DialogDescription>
            </DialogHeader>
            <div className="mt-4">{selectedItem?.fullDemo}</div>
          </DialogContent>
        </Dialog>
      </div>
    </Container>
  );
}
