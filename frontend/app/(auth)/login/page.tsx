"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { logInUser } from "@/APIs/userAPIs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// Icons
import { 
  Eye, 
  EyeOff, 
  Dumbbell, 
  Zap, 
  Target, 
  Flame,
  Mail,
  Lock,
  LogIn
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { logIn } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await logInUser({ email, password });
      logIn(response.data, response.token);
      
      // If remember me is checked, you might want to set a longer session
      // This depends on your auth implementation
      
      toast.success("Welcome back! Let's crush those goals! 💪");
      router.push("/workouts");
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Gym-themed Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-8xl text-white/20">💪</div>
          <div className="absolute bottom-20 right-10 text-8xl text-white/20">🏋️</div>
          <div className="absolute top-1/3 left-1/3 text-6xl text-white/20 rotate-12">⚡</div>
          <div className="absolute bottom-1/3 right-1/3 text-6xl text-white/20 -rotate-12">🔥</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl text-white/5">
            <Dumbbell className="w-32 h-32" />
          </div>
        </div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Motivational Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center gap-2 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg transform hover:scale-110 transition-transform">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            WELCOME<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> BACK </span>
          </h1>
          <p className="text-gray-300 text-sm flex items-center justify-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            Ready to continue your journey?
            <Flame className="w-4 h-4 text-orange-500" />
          </p>
        </div>

        {/* Login Card */}
        <Card className="backdrop-blur-lg bg-black/40 border border-white/10 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-white">
              Sign In
            </CardTitle>
            <p className="text-sm text-gray-400">
              Access your fitness dashboard
            </p>
          </CardHeader>

          <CardContent>
            {/* Quick Motivation */}
            <div className="flex justify-between items-center mb-6 p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-300">Keep pushing!</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-300">You've got this</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label className="text-gray-300 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <div className="relative">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 pl-10 focus:border-blue-500/50 focus:ring-blue-500/20"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
              </div>

              {/* Password Field with Eye Icon */}
              <div className="space-y-2">
                <Label className="text-gray-300 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 pl-10 pr-12 focus:border-blue-500/50 focus:ring-blue-500/20"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 bg-white/5 text-blue-500 focus:ring-blue-500/20 focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-400">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" />
                    SIGN IN
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-black/40 text-gray-400">New to FitFlex?</span>
              </div>
            </div>

            {/* Signup Link */}
            <div className="text-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold group"
              >
                <Dumbbell className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Create your account
                <Target className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Benefits */}
            <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="text-gray-400">
                <div className="font-bold text-yellow-400">1000+</div>
                Workouts
              </div>
              <div className="text-gray-400">
                <div className="font-bold text-yellow-400">Free</div>
                Forever
              </div>
              <div className="text-gray-400">
                <div className="font-bold text-yellow-400">24/7</div>
                Access
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motivational Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <span>🔥</span>
            EVERY REP BRINGS YOU CLOSER
            <span>🔥</span>
          </p>
        </div>
      </div>

    </div>
  );
}