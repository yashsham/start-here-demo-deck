import { createFileRoute, Link } from "@tanstack/react-router";
import { SignupCard } from "@/components/auth/signup-card";
import { BrandLogo } from "@/components/signal-stack/components/brand-logo";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In · Signal Stack Enterprise Intelligence" },
      {
        name: "description",
        content: "Sign in to your Signal Stack workspace to access your decision intelligence dashboard.",
      },
    ],
  }),
  component: LoginRoute,
});

function LoginRoute() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand selection:text-white relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between z-10">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-foreground hover:opacity-90 transition-opacity"
        >
          <BrandLogo size="md" />
          <div className="leading-none">
            <span className="signal-display block text-base font-bold tracking-tight text-white">
              SIGNAL STACK
            </span>
            <span className="block text-[9px] font-semibold tracking-wider text-cyan-400">
              STRATEGIC RADAR
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Workspace</span>
        </Link>
      </header>

      <main className="w-full max-w-md mx-auto px-4 py-8 flex items-center justify-center flex-1 z-10">
        <SignupCard initialMode="signin" />
      </main>

      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 text-center text-[11px] text-slate-500 z-10 border-t border-slate-800/60">
        Signal Stack Enterprise Platform · Protected by Supabase Auth & PostgreSQL RLS
      </footer>
    </div>
  );
}