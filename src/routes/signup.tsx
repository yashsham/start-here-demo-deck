import { createFileRoute, Link } from "@tanstack/react-router";
import { SignupCard } from "@/components/auth/signup-card";
import { BrandLogo } from "@/components/signal-stack/components/brand-logo";
import { ShieldCheck, Zap, Bot, Globe2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up · Signal Stack Enterprise Intelligence" },
      {
        name: "description",
        content:
          "Create your Signal Stack workspace to automate competitor intelligence, market change detection, and executive Monday Morning Briefs.",
      },
      { property: "og:title", content: "Sign Up · Signal Stack" },
      {
        property: "og:description",
        content:
          "Autonomous, evidence-grounded strategic intelligence platform powered by Supabase and Groq AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignupRoute,
});

function SignupRoute() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand selection:text-white relative overflow-hidden">
      {/* Background ambient gradient glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Bar Navigation */}
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

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center flex-1 z-10">
        {/* Left Column: Platform Value Showcase */}
        <div className="hidden lg:flex flex-col space-y-8 pr-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-3 py-1 text-[11px] font-semibold text-cyan-400">
              <Zap className="size-3 text-cyan-400" />
              <span>Next-Gen Enterprise Intelligence</span>
            </div>
            <h2 className="signal-display text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Preempt market shifts with autonomous, evidence-grounded intelligence.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
              Signal Stack continuously monitors verified public sources, filters noise with LangGraph agentic reasoning, and synthesizes decision-ready executive briefs for leadership teams.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-brand">
                <Globe2 className="size-4" />
                <h4 className="text-xs font-bold text-slate-200">Polite Crawler Pool</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Monitors RSS, sitemaps, regulatory gazettes, and forums with strict SSRF & robots.txt safeguards.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-cyan-400">
                <Bot className="size-4" />
                <h4 className="text-xs font-bold text-slate-200">Self-Correcting AI</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                LangGraph state machine audits every claim against verbatim evidence to eliminate hallucinations.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="size-4" />
                <h4 className="text-xs font-bold text-slate-200">Multi-Tenant Isolation</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                PostgreSQL Row-Level Security ensures strict multi-tenant perimeter and role-based access.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-amber-400">
                <Zap className="size-4" />
                <h4 className="text-xs font-bold text-slate-200">Monday Morning Briefs</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Automated weekly delivery of 10-section strategic briefs with citation-backed strategic takeaways.
              </p>
            </div>
          </div>

          {/* Quote */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 text-xs text-slate-300 italic border-l-2 border-l-brand">
            &ldquo;Signal Stack transformed our weekly intelligence workflow. We identify competitor moves and regulatory directives weeks before they impact our partners.&rdquo;
            <div className="mt-2 not-italic text-[10px] text-slate-500 font-medium">
              — Strategic Intelligence Director, Enterprise EdTech
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Signup / Login Card */}
        <div className="flex justify-center w-full">
          <SignupCard initialMode="signup" />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 text-center text-[11px] text-slate-500 z-10 border-t border-slate-800/60">
        Signal Stack Enterprise Platform · Protected by Supabase Auth & PostgreSQL RLS
      </footer>
    </div>
  );
}