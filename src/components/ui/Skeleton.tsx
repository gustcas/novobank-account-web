import { cn } from "../../lib/cn";

export const SkeletonBlock = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-md bg-gray-200", className)} />
);
