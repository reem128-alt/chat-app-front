"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from "lucide-react";
import { RegisterFormData, registerSchema } from "@/types/auth";
import { registerApi } from "@/services/auth";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await registerApi(data);
      updateUser(response.user);
      toast.success("Registration successful!");
      // Small delay to ensure state is updated
      setTimeout(() => {
        router.push("/chat");
      }, 100);
    } catch (error: unknown) {
      console.error("Registration failed:", error);

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
          toast.error("Registration failed. Please try again.");
        }
      } else if (error && typeof error === "object" && "message" in error) {
        toast.error((error as { message: string }).message);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border border-purple-500/20 shadow-2xl shadow-purple-500 w-full max-w-lg mx-auto transition-all duration-300 hover:shadow-3xl hover:shadow-purple-500/20">
      <CardHeader className="space-y-1 pb-8 pt-8">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mx-auto mb-6 shadow-lg">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Create Account
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
          Join us today and start your journey
        </p>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              Username
            </Label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 w-5 h-5 transition-colors" />
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                className={`pl-12 h-12 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 rounded-xl transition-all duration-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 ${
                  errors.username
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                    : ""
                }`}
                {...register("username")}
              />
            </div>
            {errors.username && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.username.message}
              </p>
            )}
          </div>

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
                className={`pl-12 h-12 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 rounded-xl transition-all duration-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 ${
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
                className={`pl-12 pr-12 h-12 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 rounded-xl transition-all duration-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 ${
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

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              Confirm Password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 w-5 h-5 transition-colors" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className={`pl-12 pr-12 h-12 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 rounded-xl transition-all duration-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 ${
                  errors.confirmPassword
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                    : ""
                }`}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors p-1 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <input
              id="terms"
              type="checkbox"
              className="w-4 h-4 text-green-600 bg-white border-2 border-gray-300 rounded focus:ring-green-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <Label
              htmlFor="terms"
              className="text-sm text-gray-600 dark:text-gray-300 font-medium"
            >
              I agree to the{" "}
              <a
                href="#"
                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors font-semibold"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors font-semibold"
              >
                Privacy Policy
              </a>
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating account...
              </div>
            ) : (
              "Create Account"
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
                Already have an account?
              </span>
            </div>
          </div>
          <a
            href="/login"
            className="mt-4 inline-block text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors font-semibold"
          >
            Sign in instead
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
