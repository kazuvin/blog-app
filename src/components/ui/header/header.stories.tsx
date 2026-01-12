import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Header } from "./header";

const meta = {
  title: "UI/Header",
  component: Header.Root,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Header.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Header.Root>
      <Header.Logo>My Blog</Header.Logo>
    </Header.Root>
  ),
};

export const WithNavigation: Story = {
  render: () => (
    <Header.Root>
      <Header.Logo>My Blog</Header.Logo>
      <Header.Nav>
        <Header.NavList>
          <Header.NavItem href="/">Home</Header.NavItem>
          <Header.NavItem href="/blog">Blog</Header.NavItem>
          <Header.NavItem href="/about">About</Header.NavItem>
        </Header.NavList>
      </Header.Nav>
    </Header.Root>
  ),
};

export const WithGitHub: Story = {
  render: () => (
    <Header.Root>
      <Header.Logo>My Blog</Header.Logo>
      <Header.Nav>
        <Header.GitHubLink url="https://github.com/username/blog-app" />
      </Header.Nav>
    </Header.Root>
  ),
};

export const Full: Story = {
  render: () => (
    <Header.Root>
      <Header.Logo>My Blog</Header.Logo>
      <Header.Nav>
        <Header.NavList>
          <Header.NavItem href="/">Home</Header.NavItem>
          <Header.NavItem href="/blog">Blog</Header.NavItem>
          <Header.NavItem href="/about">About</Header.NavItem>
          <Header.NavItem href="/contact">Contact</Header.NavItem>
        </Header.NavList>
        <Header.GitHubLink url="https://github.com/username/blog-app" />
      </Header.Nav>
    </Header.Root>
  ),
};
