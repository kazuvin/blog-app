import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./input";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "error"],
      description: "The visual style of the input",
    },
    inputSize: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the input",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "number"],
      description: "The input type",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    placeholder: "Enter text...",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    placeholder: "Invalid input",
  },
};

export const Small: Story = {
  args: {
    inputSize: "sm",
    placeholder: "Small input",
  },
};

export const Medium: Story = {
  args: {
    inputSize: "md",
    placeholder: "Medium input",
  },
};

export const Large: Story = {
  args: {
    inputSize: "lg",
    placeholder: "Large input",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled input",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Input inputSize="sm" placeholder="Small default" />
        <Input inputSize="md" placeholder="Medium default" />
        <Input inputSize="lg" placeholder="Large default" />
      </div>
      <div className="flex flex-col gap-2">
        <Input variant="error" inputSize="sm" placeholder="Small error" />
        <Input variant="error" inputSize="md" placeholder="Medium error" />
        <Input variant="error" inputSize="lg" placeholder="Large error" />
      </div>
    </div>
  ),
};
