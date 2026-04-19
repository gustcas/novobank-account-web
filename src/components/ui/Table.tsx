import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export const Table = ({ children }: { children: ReactNode }) => (
  <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">{children}</div>
);

export const THead = ({ children }: { children: ReactNode }) => (
  <thead className="bg-slate-50 text-sm uppercase tracking-wide text-slate-700">{children}</thead>
);

export const TBody = ({ children }: { children: ReactNode }) => <tbody className="divide-y divide-border">{children}</tbody>;

export const Tr = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn("transition-colors hover:bg-orange-50/40", className)} {...props}>
    {children}
  </tr>
);

export const Th = ({ children, className }: { children: ReactNode; className?: string }) => (
  <th className={cn("px-4 py-3 text-left font-semibold", className)}>{children}</th>
);

export const Td = ({ children, className }: { children: ReactNode; className?: string }) => (
  <td className={cn("px-4 py-3 text-sm text-text-main", className)}>{children}</td>
);
