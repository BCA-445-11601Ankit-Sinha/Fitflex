"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createUser } from "@/APIs/userAPIs";
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
  User
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { logIn } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    
    try {
      await createUser({ name, email, password });
      toast.success("Account created successfully! Login to continue.");
      router.push("/login");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
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
          <div className="absolute top-1/2 left-1/4 text-6xl text-white/20 rotate-12">⚡</div>
          <div className="absolute bottom-1/3 right-1/4 text-6xl text-white/20 -rotate-12">🔥</div>
        </div>
        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Motivational Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center gap-2 mb-4">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl shadow-lg transform hover:scale-110 transition-transform">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            JOIN THE<span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> FITFLEX </span>FAMILY
          </h1>
          <p className="text-gray-300 text-sm flex items-center justify-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            Start your transformation today
            <Flame className="w-4 h-4 text-orange-500" />
          </p>
        </div>

        {/* Signup Card */}
        <Card className="backdrop-blur-lg bg-black/40 border border-white/10 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-white">
              Create Account
            </CardTitle>
            <p className="text-sm text-gray-400">
              Get started with your fitness journey
            </p>
          </CardHeader>

          <CardContent>
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 mb-6 p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-center">
                <div className="text-yellow-400 text-lg font-bold">1000+</div>
                <div className="text-xs text-gray-400">Workouts</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 text-lg font-bold">50+</div>
                <div className="text-xs text-gray-400">Programs</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 text-lg font-bold">24/7</div>
                <div className="text-xs text-gray-400">Support</div>
              </div>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label className="text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 pl-10 focus:border-yellow-500/50 focus:ring-yellow-500/20"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
              </div>

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
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 pl-10 focus:border-yellow-500/50 focus:ring-yellow-500/20"
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
                    placeholder="Create a password"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 pl-10 pr-12 focus:border-yellow-500/50 focus:ring-yellow-500/20"
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
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 6 characters
                </p>
              </div>

              {/* Password Strength Indicator (Optional) */}
              {password && (
                <div className="space-y-1">
                  <div className="flex gap-1 h-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 rounded-full transition-all ${
                          password.length >= level * 2
                            ? password.length > 8
                              ? "bg-green-500"
                              : "bg-yellow-500"
                            : "bg-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    {password.length < 6
                      ? "Weak password"
                      : password.length < 8
                      ? "Medium password"
                      : "Strong password"}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" />
                    START YOUR JOURNEY
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
                <span className="px-2 bg-black/40 text-gray-400">OR</span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-yellow-400 hover:text-yellow-300 font-semibold inline-flex items-center gap-1 group"
                >
                  Sign In
                  <Target className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center mt-4">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-yellow-400/80 hover:text-yellow-400">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-yellow-400/80 hover:text-yellow-400">
                Privacy Policy
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Motivational Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <span>💪</span>
            NO EXCUSES. JUST RESULTS.
            <span>💪</span>
          </p>
        </div>
      </div>

      
    </div>
  );
}