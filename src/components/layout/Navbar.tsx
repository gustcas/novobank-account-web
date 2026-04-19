import { LogOut } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../features/auth/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6 lg:px-8">
      <div className="min-w-0">
        <div className="text-2xl font-black tracking-tight text-slate-600 sm:text-3xl lg:text-4xl">
          NovoBanco<span className="text-accent">.</span>
        </div>
        <div className="mt-3 min-w-0">
          <p className="text-xs font-medium text-slate-500 sm:text-sm">Sesion activa</p>
          <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">{user?.fullName}</p>
        </div>
      </div>
      <Button className="mt-3 shrink-0 px-3 sm:px-4" size="sm" variant="accent" onClick={() => void logout()}>
        <LogOut className="mr-1.5 h-4 w-4 sm:mr-2" />
        Salir
      </Button>
    </header>
  );
};
