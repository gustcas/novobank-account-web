import { cn } from "../../lib/cn";

interface BrandLoaderProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export const BrandLoader = ({
  message = "Cargando informacion bancaria...",
  fullScreen = false,
  className
}: BrandLoaderProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-4 px-4 text-center",
      fullScreen && "min-h-screen",
      className
    )}
  >
    <div className="brand-loader-container bg-accent">
      <div className="brand-loader-bar brand-loader-center-v" />
      <div className="brand-loader-bar brand-loader-left-v" />
      <div className="brand-loader-bar brand-loader-right-v" />
      <div className="brand-loader-bar brand-loader-h-mid-l" />
      <div className="brand-loader-bar brand-loader-h-mid-r" />
      <div className="brand-loader-bar brand-loader-h-top-l" />
      <div className="brand-loader-bar brand-loader-h-bot-l" />
      <div className="brand-loader-bar brand-loader-h-top-r" />
      <div className="brand-loader-bar brand-loader-h-bot-r" />
    </div>
    <div className="space-y-1 text-center">
      <p className="text-sm font-semibold tracking-tight text-slate-700">Cargando</p>
      <p className="max-w-xs text-xs font-medium text-slate-500 sm:max-w-sm">{message}</p>
    </div>
  </div>
);
