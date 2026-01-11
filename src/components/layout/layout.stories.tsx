import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Layout } from "./layout";

const meta = {
  title: "Layout/Layout",
  component: Layout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      description: "Main page content",
    },
    title: {
      control: "text",
      description: "Site title displayed in the header",
    },
    showHeader: {
      control: "boolean",
      description: "Whether to show the header",
    },
    navItems: {
      description: "Navigation items with label and href",
    },
    githubUrl: {
      control: "text",
      description: "GitHub repository URL for the header",
    },
    showFooter: {
      control: "boolean",
      description: "Whether to show the footer",
    },
    footerContent: {
      description: "Custom footer content",
    },
  },
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Blog",
    showHeader: true,
    showFooter: true,
    children: (
      <div>
        <h1 className="mb-4 text-3xl font-bold">Welcome to the Blog</h1>
        <p className="text-foreground/70 mb-4">
          This is the default layout with header and footer.
        </p>
        <div className="space-y-2">
          <p>Some minimal content here.</p>
        </div>
      </div>
    ),
  },
};

export const WithNavigation: Story = {
  args: {
    title: "My Blog",
    showHeader: true,
    showFooter: true,
    navItems: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    githubUrl: "https://github.com/example/blog",
    children: (
      <div>
        <h1 className="mb-4 text-3xl font-bold">Latest Articles</h1>
        <div className="space-y-6">
          <article className="border-foreground/10 border-b pb-6">
            <h2 className="mb-2 text-xl font-semibold">Getting Started with React</h2>
            <p className="text-foreground/70 mb-2 text-sm">Published on January 10, 2025</p>
            <p className="text-foreground/80">
              Learn the fundamentals of React and build your first component...
            </p>
          </article>
          <article className="border-foreground/10 border-b pb-6">
            <h2 className="mb-2 text-xl font-semibold">Advanced TypeScript Patterns</h2>
            <p className="text-foreground/70 mb-2 text-sm">Published on January 5, 2025</p>
            <p className="text-foreground/80">
              Explore advanced TypeScript patterns to write more type-safe code...
            </p>
          </article>
        </div>
      </div>
    ),
  },
};

export const WithoutHeader: Story = {
  args: {
    title: "Blog",
    showHeader: false,
    showFooter: true,
    children: (
      <div>
        <h1 className="mb-4 text-3xl font-bold">Content Without Header</h1>
        <p className="text-foreground/70 mb-4">
          This layout demonstrates the main content area without a header.
        </p>
        <div className="bg-foreground/5 rounded-lg p-4">
          <p>The header is hidden but the footer is still visible.</p>
        </div>
      </div>
    ),
  },
};

export const WithoutFooter: Story = {
  args: {
    title: "Blog",
    showHeader: true,
    showFooter: false,
    navItems: [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
    ],
    children: (
      <div>
        <h1 className="mb-4 text-3xl font-bold">Content Without Footer</h1>
        <p className="text-foreground/70 mb-4">
          This layout demonstrates the main content area without a footer.
        </p>
        <div className="bg-foreground/5 rounded-lg p-4">
          <p>The footer is hidden but the header is still visible.</p>
        </div>
      </div>
    ),
  },
};

export const CustomFooter: Story = {
  args: {
    title: "My Portfolio",
    showHeader: true,
    showFooter: true,
    navItems: [
      { label: "Home", href: "/" },
      { label: "Projects", href: "/projects" },
      { label: "Blog", href: "/blog" },
    ],
    githubUrl: "https://github.com/example",
    footerContent: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <h3 className="mb-2 font-semibold">Quick Links</h3>
            <ul className="text-foreground/70 space-y-1 text-sm">
              <li>
                <a href="#" className="hover:text-foreground">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Projects
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Resources</h3>
            <ul className="text-foreground/70 space-y-1 text-sm">
              <li>
                <a href="#" className="hover:text-foreground">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Connect</h3>
            <ul className="text-foreground/70 space-y-1 text-sm">
              <li>
                <a href="#" className="hover:text-foreground">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-foreground/10 text-foreground/60 border-t pt-4 text-center text-sm">
          <p>Copyright 2025. All rights reserved.</p>
        </div>
      </div>
    ),
    children: (
      <div>
        <h1 className="mb-4 text-3xl font-bold">Custom Footer Example</h1>
        <p className="text-foreground/70 mb-6">
          This layout features a custom multi-column footer with links and copyright information.
        </p>
        <div className="space-y-4">
          <div className="bg-foreground/5 rounded-lg p-6">
            <h2 className="mb-2 text-xl font-semibold">Featured Project</h2>
            <p className="text-foreground/80">
              A beautiful portfolio website built with Next.js and Tailwind CSS. Scroll down to see
              the custom footer with multiple columns.
            </p>
          </div>
        </div>
      </div>
    ),
  },
};

export const Full: Story = {
  args: {
    title: "Tech Blog",
    showHeader: true,
    showFooter: true,
    navItems: [
      { label: "Home", href: "/" },
      { label: "Articles", href: "/blog" },
      { label: "Categories", href: "/categories" },
      { label: "About", href: "/about" },
    ],
    githubUrl: "https://github.com/example/tech-blog",
    footerContent: (
      <div className="space-y-3">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <p className="text-foreground font-semibold">Tech Blog</p>
            <p className="text-foreground/60 text-sm">Premium content for developers</p>
          </div>
          <div className="text-foreground/60 text-sm">
            <p>Follow us on social media for updates and insights</p>
          </div>
        </div>
        <div className="border-foreground/10 text-foreground/50 border-t pt-3 text-center text-xs">
          <p>Built with Next.js • Hosted on Cloudflare • © 2025</p>
        </div>
      </div>
    ),
    children: (
      <div className="space-y-8">
        <section>
          <h1 className="mb-2 text-4xl font-bold">Welcome to Tech Blog</h1>
          <p className="text-foreground/70 text-lg">
            Explore articles, tutorials, and insights about modern web development.
          </p>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold">Featured Articles</h2>
          <div className="grid gap-6">
            {[
              {
                title: "React Server Components in Next.js 15",
                excerpt:
                  "Discover how to use React Server Components to build faster, more efficient applications...",
                date: "Jan 10, 2025",
              },
              {
                title: "Mastering TypeScript Generics",
                excerpt:
                  "A comprehensive guide to understanding and using TypeScript generics effectively...",
                date: "Jan 8, 2025",
              },
              {
                title: "Tailwind CSS v4: What's New",
                excerpt:
                  "Explore the latest features and improvements in Tailwind CSS version 4...",
                date: "Jan 5, 2025",
              },
            ].map((article, index) => (
              <article
                key={index}
                className="border-foreground/10 hover:bg-foreground/5 rounded-lg border p-4 transition-colors"
              >
                <h3 className="mb-2 text-xl font-semibold">{article.title}</h3>
                <p className="text-foreground/70 mb-2 text-sm">{article.date}</p>
                <p className="text-foreground/80">{article.excerpt}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-foreground/5 rounded-lg p-6">
          <h2 className="mb-4 text-2xl font-bold">Subscribe to Updates</h2>
          <p className="text-foreground/70 mb-4">
            Get the latest articles delivered to your inbox every week.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="border-foreground/20 bg-background flex-1 rounded-md border px-4 py-2"
            />
            <button className="bg-foreground text-background rounded-md px-6 py-2 font-medium transition-opacity hover:opacity-90">
              Subscribe
            </button>
          </div>
        </section>
      </div>
    ),
  },
};
