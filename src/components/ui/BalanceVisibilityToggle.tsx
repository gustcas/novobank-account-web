import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/cn";

export const BalanceVisibilityToggle = ({
  isVisible,
  onToggle,
  label = "Alternar visibilidad del saldo",
  className
}: {
  isVisible: boolean;
  onToggle: () => void;
  label?: string;
  className?: string;
}) => (
  <button
    aria-label={label}
    className={cn(
      "inline-flex h-9 w-9 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-accent transition-colors hover:bg-accent/15 focus:outline-none focus:ring-2 focus:ring-accent",
      className
    )}
    type="button"
    onClick={onToggle}
  >
    {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
  </button>
);
