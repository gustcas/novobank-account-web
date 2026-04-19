import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { cn } from "../../lib/cn";

type AlertVariant = "success" | "error" | "warning" | "info";

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: TriangleAlert,
  info: Info
};

export const Alert = ({ variant, children }: { variant: AlertVariant; children: ReactNode }) => {
  const Icon = icons[variant];

  return (
    <div
      className={cn("flex items-start gap-3 rounded-xl border border-accent/25 bg-accent/10 p-4 text-sm text-accent")}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
};
