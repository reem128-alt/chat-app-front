"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { LoginFormData, loginSchema } from "@/types/auth";
import { login } from "@/services/auth";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await login(data);
      updateUser(response.user);
      toast.success("Login successful!");
      // Use window.location.href for reliable redirection after login
      window.location.href = "/";
    } catch (error: unknown) {
      console.error("Login failed:", error);

      // Handle different error types
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string; error?: string } };
        };
        if (axiosError.response?.data?.message) {
          toast.error(axiosError.response.data.message);
        } else if (axiosError.response?.data?.error) {
          toast.error(axiosError.response.data.error);
        } else {
          toast.error("Login failed. Please try again.");
        }
      } else if (error && typeof error === "object" && "message" in error) {
        toast.error((error as { message: string }).message);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto overflow-hidden border border-white/15 bg-gradient-to-b from-slate-950/80 via-slate-900/70 to-slate-950/60 shadow-[0_20px_80px_rgba(2,6,23,0.85)] backdrop-blur-xl">
      <CardHeader className="space-y-5 pb-6 pt-10 text-center">
     
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-white">Sign in to continue</h2>
          <p className="text-sm text-slate-300">
            Slide back into the calm canvas—everything you left is exactly where you need it.
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-10 pb-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              Email Address
            </Label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 w-5 h-5 transition-colors" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`pl-12 h-12 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-300 rounded-xl transition-all duration-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 ${
                  errors.email
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                    : ""
                }`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              Password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 w-5 h-5 transition-colors" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`pl-12 pr-12 h-12 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-300 rounded-xl transition-all duration-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 ${
                  errors.password
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                    : ""
                }`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors p-1 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex items-center gap-3 text-left">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-5 w-5 rounded border-white/30 bg-transparent text-emerald-500 focus:ring-emerald-400"
                />
                <span>Keep me signed in on this device</span>
              </label>
              <a
                href="#"
                className="text-xs uppercase tracking-[0.3em] text-emerald-200 hover:text-emerald-100 transition-colors"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-14 rounded-2xl border border-emerald-400/80 bg-transparent text-lg font-semibold text-white transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-300/10 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 dark:bg-gray-900/80 text-gray-500 dark:text-gray-400">
                Need an account?
              </span>
            </div>
          </div>
          <a
            href="/register"
            className="mt-4 inline-block text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors font-semibold"
          >
            Create new account
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
