import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
import { AppSidebar } from "./components/app-sidebar";
import { AppHeader } from "./components/app-header";
import { OverviewScreen } from "./screens/overview-screen";
import { SetupScreen } from "./screens/setup-screen";
import { ResearchScreen } from "./screens/research-screen";
import { InterviewScreen } from "./screens/interview-screen";
import { ProfileScreen } from "./screens/profile-screen";
import { SignalsScreen } from "./screens/signals-screen";
import { SourcesScreen } from "./screens/sources-screen";
import { FeedScreen } from "./screens/feed-screen";
import { BriefScreen } from "./screens/brief-screen";
import { AutomationScreen } from "./screens/automation-screen";
import { OperationsScreen } from "./screens/operations-screen";
import { SettingsScreen } from "./screens/settings-screen";
import {
  companies,
  previewSources,
  type CompanyName,
  type Section,
  type PreviewSource,
} from "./data";
import { useAuth } from "@/lib/auth-context";
import { SignupCard } from "@/components/auth/signup-card";
import { BrandLogo } from "./components/brand-logo";

export function AppShell({ page }: { page: Section }) {
  const navigate = useNavigate();
  const { profile, isLoading } = useAuth();
  const [company, setCompany] = useState<CompanyName>("EDXSO");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [sources, setSources] = useState<PreviewSource[]>(previewSources);

  // Initialize theme from localStorage / system preference
  useEffect(() => {
    const stored = window.localStorage.getItem("signal-stack-theme");
    if (stored === "dark") {
      setIsDark(true);
    } else if (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem("signal-stack-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const currentCompanyInfo = companies.find((c) => c.name === company) ?? companies[0]!;

  const handleNavigate = (section: Section) => {
    void navigate({ to: "/workspace/$section", params: { section } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <BrandLogo size="xl" className="animate-pulse shadow-lg" />
        <span className="text-xs font-mono text-cyan-400">AUTHENTICATING SIGNAL STACK...</span>
      </div>
    );
  }

  // Without signin or login do not show dashboard
  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand selection:text-white relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

        <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5 text-foreground">
            <BrandLogo size="md" />
            <div className="leading-none">
              <span className="signal-display block text-base font-bold tracking-tight text-white">
                SIGNAL STACK
              </span>
              <span className="block text-[9px] font-semibold tracking-wider text-cyan-400">
                STRATEGIC RADAR
              </span>
            </div>
          </div>
          <div className="rounded-full border border-rose-500/30 bg-rose-950/20 px-3 py-1 text-[11px] font-medium text-rose-300 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span>Sign In Required</span>
          </div>
        </header>

        <main className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center flex-1 z-10">
          <div className="hidden lg:flex flex-col space-y-6 pr-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-3 py-1 text-[11px] font-semibold text-cyan-400 w-fit">
              <span className="size-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Executive Workspace Perimeter</span>
            </div>
            <h1 className="signal-display text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Sign in or create an account to access your intelligence dashboard.
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
              Signal Stack enforces zero-trust tenant boundaries. Sign in with your work email or Google account to view monitored company signals, crawler health, and synthesized Monday Morning Briefs.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-xs space-y-1">
                <span className="font-bold text-white block">PostgreSQL RLS</span>
                <span className="text-slate-400 text-[11px] block">Cryptographic tenant data isolation</span>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-xs space-y-1">
                <span className="font-bold text-white block">Google OAuth &amp; Email</span>
                <span className="text-slate-400 text-[11px] block">Supabase enterprise auth with PKCE</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center w-full">
            <SignupCard initialMode="signup" />
          </div>
        </main>

        <footer className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 text-center text-[11px] text-slate-500 z-10 border-t border-slate-800/60">
          Signal Stack Enterprise Platform · Protected by Supabase Auth &amp; PostgreSQL RLS
        </footer>
      </div>
    );
  }

  return (
    <div className="signal-frame flex min-h-screen w-full bg-background text-foreground antialiased selection:bg-brand-soft selection:text-brand">
      {/* Toast provider */}
      <Toaster position="top-right" richColors />

      {/* Persistent Sidebar */}
      <AppSidebar
        currentSection={page}
        currentCompany={currentCompanyInfo}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Workspace Frame */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden">
        {/* Persistent Topbar */}
        <AppHeader
          currentCompany={company}
          onCompanyChange={setCompany}
          onOpenMobile={() => setMobileOpen(true)}
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
        />

        {/* Content Canvas with Motion Transitions */}
        <main id="main-content" className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 md:px-8 md:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${page}-${company}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {page === "overview" && (
                <OverviewScreen
                  company={company}
                  onNavigate={handleNavigate}
                />
              )}
              {page === "setup" && (
                <SetupScreen
                  company={company}
                  onNavigate={handleNavigate}
                />
              )}
              {page === "research" && (
                <ResearchScreen
                  company={company}
                />
              )}
              {page === "interview" && (
                <InterviewScreen
                  company={company}
                  onNavigate={handleNavigate}
                />
              )}
              {page === "profile" && (
                <ProfileScreen
                  company={company}
                />
              )}
              {page === "signals" && (
                <SignalsScreen />
              )}
              {page === "sources" && (
                <SourcesScreen
                  sources={sources}
                  setSources={setSources}
                />
              )}
              {page === "feed" && (
                <FeedScreen />
              )}
              {page === "brief" && (
                <BriefScreen
                  company={company}
                />
              )}
              {page === "automation" && (
                <AutomationScreen />
              )}
              {page === "operations" && (
                <OperationsScreen />
              )}
              {page === "settings" && (
                <SettingsScreen
                  company={company}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Global Footer */}
        <footer className="mt-auto border-t border-border/80 bg-card/40 px-4 py-3.5 text-[11px] text-muted-foreground md:px-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-success" />
            <span>Signal Stack · Enterprise Intelligence & Executive Briefing Engine</span>
          </div>
          <span>Frontend Architecture · Designed for Antigravity Hono Backend</span>
        </footer>
      </div>
    </div>
  );
}