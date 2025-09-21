"use client";

import { MessageSquare, Shield, Users } from "lucide-react";

interface AuthLoadingPageProps {
  message?: string;
  type?: "login" | "register" | "auth";
}

export const AuthLoadingPage: React.FC<AuthLoadingPageProps> = ({
  message = "Authenticating...",
  type = "auth",
}) => {
  const getIcon = () => {
    switch (type) {
      case "login":
        return <Shield className="w-10 h-10 text-white" />;
      case "register":
        return <Users className="w-10 h-10 text-white" />;
      default:
        return <MessageSquare className="w-10 h-10 text-white" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "login":
        return "Signing you in...";
      case "register":
        return "Creating your account...";
      default:
        return "Authenticating...";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* Auth Icon */}
        <div className="space-y-4 animate-fade-in">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
              {getIcon()}
            </div>
            {/* Security indicator */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              {getTitle()}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {message}
            </p>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="space-y-6 animate-slide-up">
          {/* Security Loading Spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 rounded-full mx-auto"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-transparent border-t-green-500 border-r-blue-500 rounded-full animate-spin"></div>
          </div>

          {/* Security Steps */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Verifying credentials</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <span>Establishing secure connection</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <div
                className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <span>Preparing your workspace</span>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="animate-fade-in" style={{ animationDelay: "1.5s" }}>
          <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Secure Authentication
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Your data is protected with industry-standard encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLoadingPage;
