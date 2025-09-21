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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* Logo and Branding */}
        {showLogo && (
          <div className="space-y-4 animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ChatApp
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Connecting people through conversations
              </p>
            </div>
          </div>
        )}

        {/* Loading Animation */}
        <div className="space-y-6 animate-slide-up">
          {/* Main Loading Spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 rounded-full mx-auto"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
          </div>

          {/* Loading Dots */}
          <div className="flex justify-center space-x-2">
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>

          {/* Loading Message */}
          <div className="space-y-2">
            <p className="text-slate-700 dark:text-slate-300 font-medium">
              {message}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Please wait while we prepare everything for you</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          className="w-full max-w-xs mx-auto animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse-slow"></div>
          </div>
        </div>

        {/* Fun Loading Tips */}
        <div
          className="space-y-3 animate-fade-in"
          style={{ animationDelay: "1s" }}
        >
          <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Did you know?
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
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
