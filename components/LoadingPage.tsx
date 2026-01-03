"use client";

import { MessageSquare, Loader2 } from "lucide-react";

interface LoadingPageProps {
  message?: string;
  showLogo?: boolean;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({
  message = "Loading...",
  showLogo = true,
}) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 flex items-center justify-center p-4 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_55%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.18),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_120deg_at_50%_50%,rgba(59,130,246,0.15),rgba(14,165,233,0.12),rgba(236,72,153,0.12))] opacity-60 mix-blend-screen"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:120px_120px]"></div>
        </div>
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-md mx-auto">
        {/* Logo and Branding */}
        {showLogo && (
          <div className="space-y-4 animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-[0_20px_80px_rgba(16,185,129,0.35)]">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
              {/* Floating particles around logo */}
              <div
                className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.3s" }}
              ></div>
              <div
                className="absolute top-1/2 -left-3 w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-300 via-cyan-200 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
                ChatApp
              </h1>
              <p className="text-slate-200 text-sm">
                Connecting people through conversations
              </p>
            </div>
          </div>
        )}

        {/* Loading Animation */}
        <div className="space-y-6 animate-slide-up">
          {/* Main Loading Spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/10 rounded-full mx-auto"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-transparent border-t-emerald-400 border-r-cyan-400 rounded-full animate-spin"></div>
          </div>

          {/* Loading Dots */}
          <div className="flex justify-center space-x-2">
            <div
              className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>

          {/* Loading Message */}
          <div className="space-y-2">
            <p className="text-slate-100 font-medium">
              {message}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
              <span>Please wait while we prepare everything for you</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          className="w-full max-w-xs mx-auto animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 rounded-full animate-pulse-slow"></div>
          </div>
        </div>

        {/* Fun Loading Tips */}
        <div
          className="space-y-3 animate-fade-in"
          style={{ animationDelay: "1s" }}
        >
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">
                  Did you know?
                </p>
                <p className="text-xs text-slate-200/80">
                  Chat rooms help bring people together from all around the
                  world!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact loading component for smaller spaces
export const CompactLoading: React.FC<{ message?: string }> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm">{message}</p>
      </div>
    </div>
  );
};

// Inline loading component for buttons and small areas
export const InlineLoading: React.FC<{ size?: "sm" | "md" | "lg" }> = ({
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <Loader2 className={`${sizeClasses[size]} animate-spin text-current`} />
  );
};

export default LoadingPage;
