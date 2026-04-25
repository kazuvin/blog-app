import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  Header,
  HeaderGitHubLink,
  HeaderLogo,
  HeaderNav,
  HeaderNavItem,
  HeaderNavList,
  Main,
} from "@/components";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Header>
            <HeaderLogo />
            <HeaderNav>
              <HeaderNavList>
                <HeaderNavItem href="/blog">Blog</HeaderNavItem>
                <HeaderNavItem href="/showcases">Showcases</HeaderNavItem>
                <HeaderNavItem href="/playgrounds">Playgrounds</HeaderNavItem>
              </HeaderNavList>
              <HeaderGitHubLink url="https://github.com" />
            </HeaderNav>
          </Header>
          <Main>{children}</Main>
        </Providers>
      </body>
    </html>
  );
}
