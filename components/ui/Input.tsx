"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

const base =
  "w-full rounded-md bg-bg-soft border border-line px-3 py-2 text-ink-DEFAULT placeholder:text-ink-dim focus:outline-none focus:border-accent transition-colors";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={twMerge(clsx(base, className))} {...rest} />;
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      className={twMerge(clsx(base, "min-h-[88px] resize-y font-serif leading-relaxed", className))}
      {...rest}
    />
  );
});

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs font-mono uppercase tracking-wider text-ink-muted">{label}</span>
        {hint && <span className="text-[11px] text-ink-dim">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

export function Select({
  className,
  ...rest
}: InputHTMLAttributes<HTMLSelectElement> & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={twMerge(clsx(base, "appearance-none bg-bg-soft pr-9 cursor-pointer", className))}
      {...rest}
    />
  );
}
