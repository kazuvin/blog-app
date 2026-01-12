import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "My Blog",
    template: "%s | My Blog",
  },
  description: "Thoughts, stories, and ideas about web development and technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header.Root>
          <Header.Logo>My Blog</Header.Logo>
          <Header.Nav>
            <Header.NavList>
              <Header.NavItem href="/">Home</Header.NavItem>
              <Header.NavItem href="/blog">Blog</Header.NavItem>
              <Header.NavItem href="/about">About</Header.NavItem>
            </Header.NavList>
            <Header.GitHubLink url="https://github.com" />
          </Header.Nav>
        </Header.Root>
        <main>{children}</main>
      </body>
    </html>
  );
}
