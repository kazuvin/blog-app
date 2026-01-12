import Link from "next/link";
import { type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type HeaderProps = ComponentProps<"header">;

export function Header({ className, children, ...props }: HeaderProps) {
  return (
    <header
      className={cn("border-foreground/10 bg-background w-full border-b", className)}
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

export function HeaderLogo({ href = "/", className, children, ...props }: HeaderLogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "text-foreground hover:text-foreground/80 text-xl font-bold transition-colors",
        className
      )}
      {...props}
    >
      {children}
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
          "text-foreground/60 hover:text-foreground text-sm font-medium transition-colors",
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
      className={cn("text-foreground/60 hover:text-foreground transition-colors", className)}
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
      className={cn("text-foreground/60 hover:text-foreground transition-colors", className)}
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
