import React from "react";
import LoginForm from "./components/loginform";
import { GradientBackground } from "@/components/GradientBackground";

export default function LoginPage() {
  return (
    <GradientBackground>
      <section className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl text-center space-y-4">
          <p className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-teal-200">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-300 to-sky-400 animate-pulse" />
            Login
          </p>
        </div>

        <div className="mt-5 w-full max-w-5xl">
          <LoginForm />
        </div>
      </section>
    </GradientBackground>
  );
}
