import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type BadgeVariant = "ACTIVE" | "BLOCKED" | "CLOSED" | "success" | "danger" | "info";

export const Badge = ({ variant, children }: { variant: BadgeVariant; children: ReactNode }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
      variant === "ACTIVE" && "border-accent/30 bg-accent/10 text-accent",
      variant === "BLOCKED" && "border-warning/30 bg-warning/10 text-warning",
      variant === "CLOSED" && "border-gray-200 bg-gray-100 text-gray-500",
      variant === "success" && "border-success/30 bg-success/10 text-success",
      variant === "danger" && "border-danger/30 bg-danger/10 text-danger",
      variant === "info" && "border-accent/30 bg-accent/10 text-accent"
    )}
  >
    {children}
  </span>
);
