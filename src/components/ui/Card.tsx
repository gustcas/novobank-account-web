import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export const Card = ({
  children,
  accent = false,
  className
}: {
  children: ReactNode;
  accent?: boolean;
  className?: string;
}) => (
  <div
    className={cn(
      "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",
      accent && "border-l-4 border-l-accent",
      className
    )}
  >
    {children}
  </div>
);
