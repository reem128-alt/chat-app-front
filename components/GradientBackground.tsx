import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GradientBackgroundProps {
  children: ReactNode;
  className?: string;
}

export function GradientBackground({ children, className }: GradientBackgroundProps) {
  return (
    <main className={cn("relative min-h-screen overflow-hidden bg-slate-950 text-white", className)}>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_120deg_at_50%_50%,rgba(59,130,246,0.15),rgba(14,165,233,0.12),rgba(236,72,153,0.12))] opacity-60 mix-blend-screen" />
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:120px_120px]" />
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </main>
  );
}
