"use client";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./dialog";

const meta = {
  title: "UI/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "alert"],
      description: "The visual style of the dialog",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the dialog",
    },
    open: {
      control: "boolean",
      description: "Whether the dialog is open",
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>
              This is a basic dialog with a title, description, and some content.
            </DialogDescription>
          </DialogHeader>
          <DialogContent>
            <p>This is the main content area of the dialog.</p>
          </DialogContent>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Confirm</Button>
          </DialogFooter>
        </Dialog>
      </div>
    );
  },
};

export const Alert: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Alert Dialog</Button>
        <Dialog open={open} onOpenChange={setOpen} variant="alert">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogContent>
            <p className="text-foreground/80 text-sm">
              All of your data will be permanently removed from our servers. This includes all
              posts, comments, and profile information.
            </p>
          </DialogContent>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Delete Account</Button>
          </DialogFooter>
        </Dialog>
      </div>
    );
  },
};

export const Small: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Small Dialog</Button>
        <Dialog open={open} onOpenChange={setOpen} size="sm">
          <DialogHeader>
            <DialogTitle>Small Dialog</DialogTitle>
            <DialogDescription>This is a small-sized dialog.</DialogDescription>
          </DialogHeader>
          <DialogContent>
            <p className="text-sm">Compact content for quick interactions.</p>
          </DialogContent>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>OK</Button>
          </DialogFooter>
        </Dialog>
      </div>
    );
  },
};

export const Large: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Large Dialog</Button>
        <Dialog open={open} onOpenChange={setOpen} size="lg">
          <DialogHeader>
            <DialogTitle>Large Dialog</DialogTitle>
            <DialogDescription>This is a large-sized dialog with more space.</DialogDescription>
          </DialogHeader>
          <DialogContent>
            <p className="mb-4 text-sm">
              Large dialogs are perfect for complex content or multiple sections of information.
            </p>
            <p className="mb-4 text-sm">
              You can use this extra space to display detailed information, multiple form fields, or
              comprehensive explanations.
            </p>
            <p className="text-sm">
              The larger size helps prevent scrolling and makes content more accessible.
            </p>
          </DialogContent>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Continue</Button>
          </DialogFooter>
        </Dialog>
      </div>
    );
  },
};

export const WithForm: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Create Profile</Button>
        <Dialog open={open} onOpenChange={setOpen} size="md">
          <DialogHeader>
            <DialogTitle>Create Profile</DialogTitle>
            <DialogDescription>Enter your information to create a new profile.</DialogDescription>
          </DialogHeader>
          <DialogContent>
            <form className="flex flex-col gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="John Doe" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" placeholder="Tell us about yourself" className="mt-1.5" />
              </div>
            </form>
          </DialogContent>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Create Profile</Button>
          </DialogFooter>
        </Dialog>
      </div>
    );
  },
};

export const AllVariants: Story = {
  render: () => {
    const [defaultOpen, setDefaultOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [smallOpen, setSmallOpen] = useState(false);
    const [largeOpen, setLargeOpen] = useState(false);

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button onClick={() => setDefaultOpen(true)}>Default</Button>
          <Button onClick={() => setAlertOpen(true)}>Alert</Button>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={() => setSmallOpen(true)}>Small</Button>
          <Button onClick={() => setLargeOpen(true)}>Large</Button>
        </div>

        <Dialog open={defaultOpen} onOpenChange={setDefaultOpen}>
          <DialogHeader>
            <DialogTitle>Default Dialog</DialogTitle>
            <DialogDescription>Standard dialog with default styling.</DialogDescription>
          </DialogHeader>
          <DialogContent>
            <p className="text-sm">This is the default dialog variant.</p>
          </DialogContent>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDefaultOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setDefaultOpen(false)}>OK</Button>
          </DialogFooter>
        </Dialog>

        <Dialog open={alertOpen} onOpenChange={setAlertOpen} variant="alert">
          <DialogHeader>
            <DialogTitle>Alert Dialog</DialogTitle>
            <DialogDescription>Alert dialog for important actions.</DialogDescription>
          </DialogHeader>
          <DialogContent>
            <p className="text-sm">This is the alert dialog variant with red border.</p>
          </DialogContent>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAlertOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAlertOpen(false)}>Confirm</Button>
          </DialogFooter>
        </Dialog>

        <Dialog open={smallOpen} onOpenChange={setSmallOpen} size="sm">
          <DialogHeader>
            <DialogTitle>Small Dialog</DialogTitle>
            <DialogDescription>Compact size dialog.</DialogDescription>
          </DialogHeader>
          <DialogContent>
            <p className="text-sm">Small size variant.</p>
          </DialogContent>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSmallOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setSmallOpen(false)}>OK</Button>
          </DialogFooter>
        </Dialog>

        <Dialog open={largeOpen} onOpenChange={setLargeOpen} size="lg">
          <DialogHeader>
            <DialogTitle>Large Dialog</DialogTitle>
            <DialogDescription>Spacious dialog for complex content.</DialogDescription>
          </DialogHeader>
          <DialogContent>
            <p className="text-sm">Large size variant with more space.</p>
          </DialogContent>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setLargeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setLargeOpen(false)}>OK</Button>
          </DialogFooter>
        </Dialog>
      </div>
    );
  },
};
