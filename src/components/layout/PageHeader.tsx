export const PageHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="space-y-1">
    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
    <p className="text-sm font-medium text-slate-500">{subtitle}</p>
  </div>
);
