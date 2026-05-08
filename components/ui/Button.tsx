"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "branch";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed";

const styles: Record<Variant, string> = {
  primary:
    "bg-accent text-parchment hover:bg-accent-soft px-4 py-2 shadow-glow",
  secondary:
    "bg-bg-panel text-ink-DEFAULT border border-line hover:border-accent/60 hover:text-accent-glow px-4 py-2",
  ghost:
    "text-ink-muted hover:text-ink-DEFAULT hover:bg-bg-panel px-3 py-1.5",
  branch:
    "w-full text-left bg-bg-soft border border-line hover:border-accent hover:bg-bg-panel hover:text-accent-glow text-ink-DEFAULT px-4 py-3 font-serif",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", loading, disabled, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={twMerge(clsx(base, styles[variant], className))}
      {...rest}
    >
      {loading && (
        <span className="inline-block size-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
      )}
      {children}
    </button>
  );
});
