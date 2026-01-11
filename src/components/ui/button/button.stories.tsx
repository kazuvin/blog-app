import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";

const meta = {
	title: "UI/Button",
	component: Button,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["primary", "secondary", "ghost"],
			description: "The visual style of the button",
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "The size of the button",
		},
		disabled: {
			control: "boolean",
			description: "Whether the button is disabled",
		},
		children: {
			control: "text",
			description: "The content of the button",
		},
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		variant: "primary",
		children: "Primary Button",
	},
};

export const Secondary: Story = {
	args: {
		variant: "secondary",
		children: "Secondary Button",
	},
};

export const Ghost: Story = {
	args: {
		variant: "ghost",
		children: "Ghost Button",
	},
};

export const Small: Story = {
	args: {
		size: "sm",
		children: "Small Button",
	},
};

export const Medium: Story = {
	args: {
		size: "md",
		children: "Medium Button",
	},
};

export const Large: Story = {
	args: {
		size: "lg",
		children: "Large Button",
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		children: "Disabled Button",
	},
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-4">
				<Button variant="primary" size="sm">
					Primary SM
				</Button>
				<Button variant="primary" size="md">
					Primary MD
				</Button>
				<Button variant="primary" size="lg">
					Primary LG
				</Button>
			</div>
			<div className="flex items-center gap-4">
				<Button variant="secondary" size="sm">
					Secondary SM
				</Button>
				<Button variant="secondary" size="md">
					Secondary MD
				</Button>
				<Button variant="secondary" size="lg">
					Secondary LG
				</Button>
			</div>
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="sm">
					Ghost SM
				</Button>
				<Button variant="ghost" size="md">
					Ghost MD
				</Button>
				<Button variant="ghost" size="lg">
					Ghost LG
				</Button>
			</div>
		</div>
	),
};
