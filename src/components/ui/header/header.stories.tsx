import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Header } from "./header";

const meta = {
  title: "UI/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Site title displayed as logo/brand",
    },
    navItems: {
      description: "Navigation items to display",
    },
    githubUrl: {
      control: "text",
      description: "GitHub repository URL",
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "My Blog",
  },
};

export const WithNavigation: Story = {
  args: {
    title: "My Blog",
    navItems: [
      {
        label: "Home",
        href: "/",
      },
      {
        label: "Blog",
        href: "/blog",
      },
      {
        label: "About",
        href: "/about",
      },
    ],
  },
};

export const WithGitHub: Story = {
  args: {
    title: "My Blog",
    githubUrl: "https://github.com/username/blog-app",
  },
};

export const Full: Story = {
  args: {
    title: "My Blog",
    navItems: [
      {
        label: "Home",
        href: "/",
      },
      {
        label: "Blog",
        href: "/blog",
      },
      {
        label: "About",
        href: "/about",
      },
      {
        label: "Contact",
        href: "/contact",
      },
    ],
    githubUrl: "https://github.com/username/blog-app",
  },
};
