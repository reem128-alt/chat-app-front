"use client";

import { useState } from "react";
import {
  LoadingPage,
  CompactLoading,
  InlineLoading,
} from "@/components/LoadingPage";
import { AuthLoadingPage } from "@/components/AuthLoadingPage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LoadingDemoPage() {
  const [showMainLoading, setShowMainLoading] = useState(false);
  const [showAuthLoading, setShowAuthLoading] = useState(false);
  const [showCompactLoading, setShowCompactLoading] = useState(false);

  if (showMainLoading) {
    return <LoadingPage message="Loading your chat experience..." />;
  }

  if (showAuthLoading) {
    return <AuthLoadingPage message="Signing you in..." type="login" />;
  }

  if (showCompactLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">
              Loading Components Demo
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Showcasing different loading states for your chat app
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Compact Loading</h3>
              <CompactLoading message="Loading chat rooms..." />
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Inline Loading</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <InlineLoading size="sm" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Small loading
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <InlineLoading size="md" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Medium loading
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <InlineLoading size="lg" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Large loading
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <Button
              onClick={() => setShowCompactLoading(false)}
              variant="outline"
            >
              Back to Demo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            Loading Components Showcase
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Beautiful loading states for your chat application
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Main Loading Page */}
          <Card className="p-6 hover-lift">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white font-bold">LP</span>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Main Loading Page
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Full-screen loading with branding, animations, and tips
                </p>
                <Badge variant="secondary" className="mb-4">
                  Full Screen
                </Badge>
              </div>
              <Button
                onClick={() => setShowMainLoading(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                View Demo
              </Button>
            </div>
          </Card>

          {/* Auth Loading Page */}
          <Card className="p-6 hover-lift">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white font-bold">AL</span>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Auth Loading Page
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Authentication-specific loading with security indicators
                </p>
                <Badge variant="secondary" className="mb-4">
                  Auth Focused
                </Badge>
              </div>
              <Button
                onClick={() => setShowAuthLoading(true)}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
              >
                View Demo
              </Button>
            </div>
          </Card>

          {/* Compact Loading */}
          <Card className="p-6 hover-lift">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white font-bold">CL</span>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Compact Loading
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Smaller loading states for components and sections
                </p>
                <Badge variant="secondary" className="mb-4">
                  Component
                </Badge>
              </div>
              <Button
                onClick={() => setShowCompactLoading(true)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
              >
                View Demo
              </Button>
            </div>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
              <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">
                Smooth Animations
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Beautiful transitions and micro-interactions
              </p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
              <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">
                Responsive Design
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Works perfectly on all device sizes
              </p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
              <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">
                Dark Mode
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Full support for light and dark themes
              </p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
              <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">
                Customizable
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Easy to customize messages and styling
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
