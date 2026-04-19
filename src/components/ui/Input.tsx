import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className, ...props }, ref) => (
  <label className="flex flex-col gap-1">
    {label ? <span className="text-sm font-medium text-text-main">{label}</span> : null}
    <input
      ref={ref}
      className={cn(
        "w-full rounded-md border border-border bg-surface px-3 py-2 text-text-main placeholder:text-text-muted shadow-sm transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent",
        error && "border-danger focus:border-danger focus:ring-danger",
        className
      )}
      {...props}
    />
    {error ? <span className="mt-1 text-sm text-danger">{error}</span> : null}
  </label>
));

Input.displayName = "Input";
