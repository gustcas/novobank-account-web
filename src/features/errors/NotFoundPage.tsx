import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-neutral px-4">
    <div className="max-w-md rounded-xl bg-surface p-8 text-center shadow-md">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">404</p>
      <h1 className="mt-3 text-2xl font-semibold text-text-main">Pagina no encontrada</h1>
      <p className="mt-2 text-text-muted">La ruta solicitada no existe o ya no esta disponible.</p>
      <Link
        className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-accent px-4 text-white transition-colors hover:bg-accentHover"
        to="/dashboard"
      >
        Volver
      </Link>
    </div>
  </div>
);
