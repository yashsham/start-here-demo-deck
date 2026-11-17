import React, { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Building2,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Loader2,
  Database,
  LockKeyhole,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { BrandLogo } from "@/components/signal-stack/components/brand-logo";

interface SignupCardProps {
  initialMode?: "signup" | "signin";
  onSuccess?: () => void;
}

export function SignupCard({ initialMode = "signup", onSuccess }: SignupCardProps) {
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithEmail, signInWithGoogle } = useAuth();

  const [mode, setMode] = useState<"signup" | "signin">(initialMode);
  const [fullName, setFullName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  // Dynamic password strength estimation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "None", color: "bg-slate-700" };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak", color: "bg-rose-500" };
      case 2:
        return { score: 2, label: "Fair", color: "bg-amber-500" };
      case 3:
        return { score: 3, label: "Good", color: "bg-cyan-500" };
      case 4:
        return { score: 4, label: "Strong", color: "bg-emerald-500" };
      default:
        return { score: 0, label: "None", color: "bg-slate-700" };
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid work email address.");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (mode === "signup") {
      if (!fullName.trim()) {
        setErrorMessage("Please enter your full name.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match. Please verify.");
        return;
      }
    }

    setIsSubmitting(true);

    if (mode === "signup") {
      const res = await signUpWithEmail(email, password, {
        fullName: fullName.trim(),
        organizationName: organizationName.trim() || undefined,
      });
      setIsSubmitting(false);

      if (!res.success) {
        setErrorMessage(res.error || "Signup failed. You may continue in demo mode.");
        return;
      }

      if (res.requiresEmailConfirmation) {
        setConfirmationSent(true);
      } else {
        if (onSuccess) onSuccess();
        else void navigate({ to: "/" });
      }
    } else {
      const res = await signInWithEmail(email, password);
      setIsSubmitting(false);

      if (!res.success) {
        setErrorMessage(res.error || "Sign in failed. Check your email and password.");
        return;
      }

      if (onSuccess) onSuccess();
      else void navigate({ to: "/" });
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setIsGoogleSubmitting(true);
    const res = await signInWithGoogle();
    setIsGoogleSubmitting(false);

    if (!res.success) {
      setErrorMessage(
        res.error || "Google OAuth is not configured on this Supabase project. You can sign in using Demo Mode."
      );
    }
  };


  return (
    <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      {/* Brand Header */}
      <div className="text-center flex flex-col items-center">
        <BrandLogo size="lg" className="mb-3.5 shadow-md" />
        <h1 className="signal-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {mode === "signup" ? "Create your workspace" : "Welcome back"}
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {mode === "signup"
            ? "Sign up to start monitoring strategic intelligence & competitors"
            : "Sign in to access your organization's decision intelligence briefs"}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="mt-5 grid grid-cols-2 rounded-lg border border-border/60 bg-secondary/40 p-1 text-xs">
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setErrorMessage(null);
          }}
          className={`rounded-md py-1.5 font-medium transition-colors cursor-pointer ${
            mode === "signup"
              ? "bg-card text-foreground shadow-sm font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sign Up
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setErrorMessage(null);
          }}
          className={`rounded-md py-1.5 font-medium transition-colors cursor-pointer ${
            mode === "signin"
              ? "bg-card text-foreground shadow-sm font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sign In
        </button>
      </div>

      {/* Confirmation Sent Notice */}
      {confirmationSent ? (
        <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 text-center text-emerald-300">
          <CheckCircle2 className="mx-auto size-8 text-emerald-400" />
          <h3 className="mt-2 text-sm font-bold text-emerald-100">Verification Email Sent</h3>
          <p className="mt-1 text-xs leading-relaxed text-emerald-300/90">
            We sent a confirmation link to <strong className="text-white">{email}</strong>. Click the link in your email to activate your account.
          </p>
          <div className="mt-4 pt-3 border-t border-emerald-500/20 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setConfirmationSent(false);
                setMode("signin");
              }}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium underline cursor-pointer"
            >
              Return to Sign In
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Google OAuth Provider Button */}
          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isGoogleSubmitting || isSubmitting}
              className="relative w-full h-11 border-border/80 bg-secondary/30 hover:bg-secondary/60 text-foreground text-xs font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              {isGoogleSubmitting ? (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              ) : (
                <svg className="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{mode === "signup" ? "Sign up with Google" : "Continue with Google"}</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/80" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              <span className="bg-card px-2">Or continue with work email</span>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-950/20 p-3 text-xs text-rose-300">
              <div className="flex items-start gap-2">
                <AlertTriangle className="size-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="leading-snug">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === "signup" && (
              <>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-10 pl-9 text-xs bg-secondary/20 border-border/80"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">
                    Company / Organization
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="EDXSO Technologies"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      className="h-10 pl-9 text-xs bg-secondary/20 border-border/80"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-foreground">
                Work Email <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="analyst@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 pl-9 text-xs bg-secondary/20 border-border/80"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-foreground">
                  Password <span className="text-rose-400">*</span>
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() =>
                      alert("Password reset is linked with your Supabase organization administrator.")
                    }
                    className="text-[10px] text-brand hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "signup" ? "Min. 6 characters" : "••••••••"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 pl-9 pr-9 text-xs bg-secondary/20 border-border/80"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>

              {/* Password strength meter for signup */}
              {mode === "signup" && password.length > 0 && (
                <div className="pt-1 space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-muted-foreground">Strength:</span>
                    <span className="font-semibold text-foreground">{passwordStrength.label}</span>
                  </div>
                  <div className="h-1 w-full bg-secondary rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full flex-1 transition-all ${
                          step <= passwordStrength.score ? passwordStrength.color : "bg-secondary"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {mode === "signup" && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground">
                  Confirm Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-10 pl-9 pr-9 text-xs bg-secondary/20 border-border/80"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || isGoogleSubmitting}
              className="w-full h-10 mt-2 bg-brand text-brand-foreground hover:bg-brand/90 text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{mode === "signup" ? "Create Account & Workspace" : "Sign In to Workspace"}</span>
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </Button>
          </form>

        </>
      )}

      {/* Trust & Compliance Badges */}
      <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-around text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <ShieldCheck className="size-3.5 text-emerald-400" />
          <span>SOC-2 Aligned</span>
        </div>
        <div className="flex items-center gap-1">
          <Database className="size-3.5 text-brand" />
          <span>Supabase Auth</span>
        </div>
        <div className="flex items-center gap-1">
          <Lock className="size-3.5 text-cyan-400" />
          <span>PostgreSQL RLS</span>
        </div>
      </div>
    </div>
  );
}