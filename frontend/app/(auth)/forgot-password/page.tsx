"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { requestPasswordResetOtp, resetPasswordWithOtp } from "@/APIs/userAPIs";
import { Dumbbell, Flame, KeyRound, Lock, Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"email" | "reset">("email");
  const [isLoading, setIsLoading] = useState(false);

  const submitOtpRequest = async (moveToResetStep: boolean) => {
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestPasswordResetOtp(trimmed);
      toast.success(res.message);
      if (moveToResetStep) setStep("reset");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(typeof msg === "string" ? msg : "Could not send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    void submitOtpRequest(true);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    const code = otp.trim();
    if (!trimmed || !code || !newPassword) {
      toast.error("Fill in email, code, and new password");
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      toast.error("Code must be 6 digits");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPasswordWithOtp({
        email: trimmed,
        otp: code,
        newPassword,
      });
      toast.success(res.message);
      router.push("/login");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(typeof msg === "string" ? msg : "Could not reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-8xl text-white/20">💪</div>
          <div className="absolute bottom-20 right-10 text-8xl text-white/20">🏋️</div>
        </div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center gap-2 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            RESET<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> PASSWORD </span>
          </h1>
          <p className="text-gray-300 text-sm flex items-center justify-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            OTP by email — no links
            <Flame className="w-4 h-4 text-orange-500" />
          </p>
        </div>

        <Card className="backdrop-blur-lg bg-black/40 border border-white/10 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-white">
              {step === "email" ? "Send code" : "Enter code & new password"}
            </CardTitle>
            <p className="text-sm text-gray-400">
              {step === "email"
                ? "We will email a 6-digit code (valid 15 minutes)."
                : "Check your inbox and enter the code below."}
            </p>
          </CardHeader>

          <CardContent>
            {step === "email" ? (
              <form onSubmit={handleRequestOtp} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-6 rounded-xl"
                >
                  {isLoading ? "Sending…" : "Send verification code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleReset} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email2" className="text-gray-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="email2"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-gray-300">
                    6-digit code
                  </Label>
                  <Input
                    id="otp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    className="bg-white/5 border-white/10 text-white tracking-[0.35em] text-center text-lg font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="np" className="text-gray-300">
                    New password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="np"
                      type="password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cp" className="text-gray-300">
                    Confirm password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="cp"
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    className="flex-1 border-white/20 bg-white/5 text-gray-200 hover:bg-white/10"
                    onClick={() => {
                      setStep("email");
                      setOtp("");
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    className="flex-1 border-white/20 bg-white/5 text-gray-200 hover:bg-white/10"
                    onClick={() => void submitOtpRequest(false)}
                  >
                    Resend code
                  </Button>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-6 rounded-xl"
                >
                  {isLoading ? "Updating…" : "Reset password"}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </Link>
            </div>

            <div className="mt-4 flex justify-center">
              <Dumbbell className="w-5 h-5 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
