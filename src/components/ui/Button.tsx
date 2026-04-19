import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "../../lib/cn";

type ButtonVariant = "primary" | "secondary" | "accent" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
}

export const Button = ({
  className,
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-lg font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50",
      variant === "primary" && "bg-accent text-white shadow-sm hover:bg-accentHover",
      variant === "secondary" && "bg-orange-50 text-accent hover:bg-orange-100",
      variant === "accent" && "bg-accent text-white shadow-sm hover:bg-accentHover",
      variant === "danger" && "bg-danger text-white hover:bg-red-700",
      variant === "ghost" && "border border-border bg-white text-text-main hover:bg-neutral",
      size === "sm" && "h-8 px-3 text-sm",
      size === "md" && "h-10 px-4 text-base",
      size === "lg" && "h-12 px-6 text-lg",
      className
    )}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
    {children}
  </button>
);
