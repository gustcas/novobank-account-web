import { CreditCard, LayoutDashboard, Repeat2, ScrollText } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../../lib/cn";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/accounts", label: "Cuentas", icon: CreditCard },
  { to: "/transfer", label: "Transferencias", icon: Repeat2 },
  { to: "/transactions", label: "Transacciones", icon: ScrollText }
];

export const Sidebar = () => (
  <aside className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur-sm lg:static lg:w-72 lg:border-t-0 lg:border-r lg:bg-white">
    <nav className="grid grid-cols-4 gap-1 px-2 py-2 lg:flex lg:flex-col lg:gap-2 lg:p-5">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl border border-transparent px-2 py-3 text-center text-xs font-semibold text-slate-600 transition-all duration-200 hover:bg-orange-50 hover:text-slate-900 lg:min-w-fit lg:flex-row lg:justify-start lg:gap-3 lg:px-4 lg:text-base lg:font-medium lg:whitespace-nowrap",
                isActive && "border-orange-200 bg-orange-50 text-slate-900 shadow-sm"
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0 text-accent" />
            <span className="truncate leading-none lg:leading-normal">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  </aside>
);
