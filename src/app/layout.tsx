import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  Header,
  HeaderGitHubLink,
  HeaderLogo,
  HeaderNav,
  HeaderNavItem,
  HeaderNavList,
} from "@/components";
import { Providers } from "./providers";
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
        <Providers>
          <Header>
            <HeaderLogo>My Blog</HeaderLogo>
            <HeaderNav>
              <HeaderNavList>
                <HeaderNavItem href="/">Home</HeaderNavItem>
                <HeaderNavItem href="/blog">Blog</HeaderNavItem>
                <HeaderNavItem href="/showcases">Showcases</HeaderNavItem>
              </HeaderNavList>
              <HeaderGitHubLink url="https://github.com" />
            </HeaderNav>
          </Header>
          <main className="container mx-auto px-4 pt-8 pb-12">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
