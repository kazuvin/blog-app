"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useScrollHeader } from "./use-scroll-header";

export type HeaderProps = ComponentProps<"header">;

export function Header({ className, children, ...props }: HeaderProps) {
  const { isScrolled } = useScrollHeader();

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 border-b bg-background transition-all duration-200 ease-out",
        isScrolled ? "border-foreground/10 pt-0" : "border-transparent pt-4",
        className
      )}
      {...props}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {children}
      </div>
    </header>
  );
}

export type HeaderLogoProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href?: string;
};

export function HeaderLogo({ href = "/", className, onClick, ...props }: HeaderLogoProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 shadow-md transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg hover:shadow-purple-500/40",
        className
      )}
      aria-label="Home"
      onClick={(e) => {
        if (isActive) {
          e.preventDefault();
        }
        onClick?.(e);
      }}
      {...props}
    >
      {/* Animated gradient overlay */}
      <span className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-violet-400 to-purple-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {/* Shimmer effect */}
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 ease-out group-hover:translate-x-full" />
    </Link>
  );
}

export type HeaderNavProps = ComponentProps<"nav">;

export function HeaderNav({ className, children, ...props }: HeaderNavProps) {
  return (
    <nav className={cn("flex items-center gap-6", className)} {...props}>
      {children}
    </nav>
  );
}

export type HeaderNavListProps = ComponentProps<"ul">;

export function HeaderNavList({ className, children, ...props }: HeaderNavListProps) {
  return (
    <ul className={cn("flex items-center gap-6", className)} {...props}>
      {children}
    </ul>
  );
}

export type HeaderNavItemProps = ComponentProps<typeof Link>;

export function HeaderNavItem({ className, children, ...props }: HeaderNavItemProps) {
  return (
    <li>
      <Link
        className={cn(
          "font-medium text-foreground/60 text-sm transition-colors hover:text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </Link>
    </li>
  );
}

export type HeaderActionProps = ComponentProps<"a"> & {
  icon?: ReactNode;
};

export function HeaderAction({ className, icon, children, ...props }: HeaderActionProps) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={cn("text-foreground/60 transition-colors hover:text-foreground", className)}
      {...props}
    >
      {icon ?? children}
    </a>
  );
}

export type HeaderGitHubLinkProps = Omit<ComponentProps<"a">, "children"> & {
  /** GitHub repository URL */
  url: string;
};

export function HeaderGitHubLink({ url, className, ...props }: HeaderGitHubLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("text-foreground/60 transition-colors hover:text-foreground", className)}
      aria-label="GitHub repository"
      {...props}
    >
      <GitHubIcon className="h-5 w-5" />
    </a>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
      />
    </svg>
  );
}
