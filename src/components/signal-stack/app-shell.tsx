import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, BookOpen, Bot, Building2,
  CalendarClock, Check, CheckCheck, ChevronDown, ChevronLeft, ChevronRight, CircleHelp,
  Clock3, Command, Compass, Download, ExternalLink, Eye, FileClock, FileText, Filter,
  Globe2, Layers3, LayoutDashboard, ListFilter, LockKeyhole, Menu, MessageSquareText,
  Moon, MoreHorizontal, Network, Plus, Printer, Radio, RefreshCw, Search, Send,
  Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Sun, Tag, Target, Upload,
  X, Zap, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  briefSections, categories, companies, navGroups, previewSignals, previewSources,
  questionsByCompany, sectionTitles, type CompanyName, type PreviewSource, type Section,
} from "./data";

const iconMap: Record<string, LucideIcon> = {
  layout: LayoutDashboard, building: Building2, search: Search, messages: MessageSquareText,
  layers: Layers3, stack: Network, sources: Globe2, feed: Radio, brief: BookOpen,
  automation: Zap, operations: Activity, settings: Settings2,
};

const categoryClasses = {
  Customers: "bg-cyan-soft text-cyan",
  Competitors: "bg-brand-soft text-brand",
  Market: "bg-warning-soft text-warning",
  Internal: "bg-success-soft text-success",
} as const;

const statusClasses = {
  Approved: "bg-success-soft text-success",
  Healthy: "bg-success-soft text-success",
  Opportunity: "bg-success-soft text-success",
  Pending: "bg-warning-soft text-warning",
  Review: "bg-warning-soft text-warning",
  Threat: "bg-danger-soft text-danger",
  Rejected: "bg-muted text-muted-foreground",
  New: "bg-cyan-soft text-cyan",
  Neutral: "bg-muted text-muted-foreground",
} as const;

function TagBadge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <Badge variant="secondary" className={`rounded-md border-0 px-2 py-0.5 text-[11px] font-semibold ${className}`}>{children}</Badge>;
}

function CategoryTag({ category }: { category: (typeof categories)[number] }) {
  return <TagBadge className={categoryClasses[category]}>{category}</TagBadge>;
}

function StateTag({ label }: { label: keyof typeof statusClasses }) {
  return <TagBadge className={statusClasses[label]}><span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-current" />{label}</span></TagBadge>;
}

function PageHeading({ page, action }: { page: Section; action?: ReactNode }) {
  const copy = sectionTitles[page];
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span>Workspace</span><ChevronRight className="size-3" /><span className="text-foreground">{copy.title}</span>
        </div>
        <h1 className="signal-display text-[26px] font-bold leading-tight tracking-[-0.02em]">{copy.title}</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">{copy.description}</p>
      </div>
      {action}
    </div>
  );
}

function PanelHeading({ title, detail, action }: { title: string; detail?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div><h2 className="signal-display text-[15px] font-bold">{title}</h2>{detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}</div>
      {action}
    </div>
  );
}

function PreviewNotice({ children = "Illustrative preview only · no live sources are connected" }: { children?: ReactNode }) {
  return <div className="inline-flex items-center gap-1.5 rounded-full border border-warning/25 bg-warning-soft px-2.5 py-1 text-[10px] font-semibold text-warning"><Sparkles className="size-3" />{children}</div>;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{children}</div>;
}

function MetricCard({ label, value, description, icon: Icon, tone = "brand", trend }: {
  label: string; value: string; description: string; icon: LucideIcon;
  tone?: "brand" | "cyan" | "warning" | "success"; trend?: string;
}) {
  const tones = { brand: "bg-brand-soft text-brand", cyan: "bg-cyan-soft text-cyan", warning: "bg-warning-soft text-warning", success: "bg-success-soft text-success" };
  return (
    <article className="signal-panel signal-panel-hover min-w-0 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3"><span className="text-[12px] font-medium text-muted-foreground">{label}</span><span className={`flex size-8 shrink-0 items-center justify-center rounded-md ${tones[tone]}`}><Icon className="size-4" /></span></div>
      <div className="mt-3 flex items-end justify-between gap-2"><span className="signal-display text-[28px] font-bold tabular-nums leading-none">{value}</span>{trend && <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-success"><ArrowUpRight className="size-3.5" />{trend}</span>}</div>
      <p className="mt-2.5 text-[11px] leading-4 text-muted-foreground">{description}</p>
    </article>
  );
}

function SignalRow({ signal }: { signal: (typeof previewSignals)[number] }) {
  return (
    <article className="border-b border-border/70 py-4 last:border-b-0 last:pb-0 first:pt-0">
      <div className="flex flex-wrap items-center gap-2"><CategoryTag category={signal.category as (typeof categories)[number]} /><StateTag label={signal.type as keyof typeof statusClasses} /><span className="text-[11px] text-muted-foreground">{signal.date}</span></div>
      <h3 className="mt-2 text-[13px] font-semibold leading-5">{signal.event}</h3>
      <p className="mt-1.5 text-xs leading-[1.7] text-muted-foreground">{signal.why}</p>
      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground"><FileText className="size-3.5" />{signal.source}</div>
    </article>
  );
}

function SourceMiniRow({ source }: { source: PreviewSource }) {
  return (
    <div className="flex items-center gap-3 border-b border-border/60 py-3 last:border-0 last:pb-0">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground"><Globe2 className="size-4" /></span>
      <div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold">{source.name}</div><div className="mt-1 truncate text-[11px] text-muted-foreground">{source.url}</div></div>
      <div className="hidden shrink-0 sm:block"><CategoryTag category={source.category} /></div>
      <StateTag label={source.health} />
    </div>
  );
}

function WorkspaceLink({ section, current, collapsed, onClick }: { section: Section; current: Section; collapsed: boolean; onClick?: () => void }) {
  const item = navGroups.flatMap((group) => group.items).find((entry) => entry.id === section);
  if (!item) return null;
  const Icon = iconMap[item.icon];
  return (
    <Link to="/workspace/$section" params={{ section }} aria-label={collapsed ? item.label : undefined} title={collapsed ? item.label : undefined} onClick={onClick} data-active={current === section} className={`signal-sidebar-link flex min-h-10 items-center gap-3 rounded-md px-3 text-[12px] font-medium ${collapsed ? "justify-center px-0" : ""}`}>
      <Icon className="size-[17px] shrink-0" /><span className={collapsed ? "sr-only" : "truncate"}>{item.label}</span>
      {section === "brief" && !collapsed && <span className="ml-auto size-1.5 rounded-full bg-warning" />}
    </Link>
  );
}

function Sidebar({ page, company, collapsed, onCollapse, mobileOpen, onMobileClose }: {
  page: Section; company: CompanyName; collapsed: boolean; onCollapse: () => void; mobileOpen: boolean; onMobileClose: () => void;
}) {
  return (
    <>
      {mobileOpen && <button type="button" aria-label="Close navigation" onClick={onMobileClose} className="fixed inset-0 z-40 cursor-pointer bg-foreground/30 lg:hidden" />}
      <aside className={`signal-sidebar fixed inset-y-0 left-0 z-50 flex w-[258px] flex-col border-r border-sidebar-border transition-[width,transform] duration-200 lg:relative lg:z-auto lg:translate-x-0 ${collapsed ? "lg:w-[76px]" : "lg:w-[258px]"} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className={`flex h-[68px] shrink-0 items-center border-b border-sidebar-border ${collapsed ? "justify-center px-3" : "justify-between px-5"}`}>
          <Link to="/" className="flex min-w-0 items-center gap-3 text-sidebar-foreground" onClick={onMobileClose} aria-label="Signal Stack home">
            <span className="grid size-8 shrink-0 grid-cols-2 gap-[3px] rounded-[7px] border border-sidebar-border bg-sidebar-hover p-[6px]"><span className="rounded-[2px] bg-sidebar-primary" /><span className="rounded-[2px] bg-sidebar-primary/60" /><span className="rounded-[2px] bg-cyan" /><span className="rounded-[2px] bg-sidebar-primary/40" /></span>
            {!collapsed && <span className="min-w-0"><span className="signal-brand block truncate text-[14px] font-bold tracking-tight">signal stack</span><span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.11em] text-sidebar-muted">Company intelligence</span></span>}
          </Link>
          <Button type="button" variant="ghost" size="icon" onClick={onMobileClose} className="size-8 text-sidebar-muted hover:text-sidebar-foreground lg:hidden" aria-label="Close navigation"><X className="size-4" /></Button>
        </div>

        <div className={`${collapsed ? "px-2.5" : "px-4"} py-4`}>
          {!collapsed && <div className="mb-2 px-2 text-[9px] font-semibold uppercase tracking-[0.11em] text-sidebar-muted">ACTIVE WORKSPACE</div>}
          <div className={`flex items-center rounded-md border border-sidebar-border bg-sidebar-hover/60 p-2 ${collapsed ? "justify-center" : "gap-3"}`}>
            <span className="grid size-8 shrink-0 place-items-center rounded bg-sidebar-primary/15 text-[10px] font-bold text-sidebar-primary">{companies.find((item) => item.name === company)?.monogram}</span>
            {!collapsed && <span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-semibold">{company}</span><span className="mt-0.5 block truncate text-[10px] text-sidebar-muted">Illustrative workspace</span></span>}
            {!collapsed && <ChevronDown className="size-3.5 text-sidebar-muted" />}
          </div>
        </div>

        <nav aria-label="Main navigation" className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 pb-4">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && <div className="mb-2 px-2 text-[9px] font-semibold tracking-[0.12em] text-sidebar-muted">{group.label}</div>}
              <div className="space-y-1">{group.items.map(({ id }) => <WorkspaceLink key={id} section={id} current={page} collapsed={collapsed} onClick={onMobileClose} />)}</div>
            </div>
          ))}
        </nav>

        <div className={`shrink-0 border-t border-sidebar-border p-3 ${collapsed ? "text-center" : ""}`}>
          <div className={`flex items-center gap-2 rounded-md bg-sidebar-hover/70 p-2.5 ${collapsed ? "justify-center" : ""}`}><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-cyan/15 text-[10px] font-bold text-cyan">AK</span>{!collapsed && <span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-semibold">Alex Kim</span><span className="block truncate text-[10px] text-sidebar-muted">Preview workspace</span></span>}{!collapsed && <MoreHorizontal className="size-4 text-sidebar-muted" />}</div>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={onCollapse} className="absolute right-[-13px] top-[76px] hidden size-7 rounded-full border border-border bg-card text-muted-foreground shadow-sm lg:flex" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}</Button>
      </aside>
    </>
  );
}

function Topbar({ company, setCompany, collapsed, onMobileMenu, isDark, onToggleTheme, search, setSearch }: {
  company: CompanyName; setCompany: (company: CompanyName) => void; collapsed: boolean; onMobileMenu: () => void;
  isDark: boolean; onToggleTheme: () => void; search: string; setSearch: (value: string) => void;
}) {
  const navigate = useNavigate();
  const [notifyOpen, setNotifyOpen] = useState(false);
  const matchedPages = useMemo(() => navGroups.flatMap((group) => group.items).filter((item) => item.label.toLowerCase().includes(search.toLowerCase()) && search.length > 0), [search]);
  return (
    <header className="sticky top-0 z-30 flex h-[62px] items-center gap-3 border-b border-border/80 bg-background/95 px-4 backdrop-blur md:px-6">
      <Button type="button" variant="ghost" size="icon" className="size-8 shrink-0 text-muted-foreground lg:hidden" onClick={onMobileMenu} aria-label="Open navigation"><Menu className="size-4" /></Button>
      <div className="hidden min-w-0 items-center gap-2 text-[11px] sm:flex"><span className="text-muted-foreground">Workspace</span><ChevronRight className="size-3 text-muted-foreground" /><span className="max-w-[160px] truncate font-semibold">{company}</span></div>
      <div className="relative ml-auto flex min-w-0 flex-1 justify-end gap-1 sm:flex-none sm:gap-2">
        <label className="relative hidden w-[230px] md:block lg:w-[258px]">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search this workspace" aria-label="Search this workspace" className="h-[34px] rounded-md border-border bg-card pl-9 pr-12 text-xs placeholder:text-muted-foreground/80" />
          <span className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5 rounded border border-border px-1 text-[9px] text-muted-foreground"><Command className="size-2.5" />K</span>
          {search.length > 0 && <div className="absolute left-0 right-0 top-[40px] z-50 overflow-hidden rounded-md border border-border bg-popover shadow-lg"><div className="border-b border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Pages</div>{matchedPages.length ? matchedPages.map((item) => <button key={item.id} type="button" className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-xs hover:bg-accent" onClick={() => { void navigate({ to: "/workspace/$section", params: { section: item.id } }); setSearch(""); }}><Search className="size-3.5 text-muted-foreground" />{item.label}<ArrowRight className="ml-auto size-3.5 text-muted-foreground" /></button>) : <div className="px-3 py-3 text-xs text-muted-foreground">No matching workspace pages.</div>}</div>}
        </label>
        <div className="relative">
          <Button type="button" variant="ghost" size="icon" onClick={() => setNotifyOpen((value) => !value)} className="relative size-8 text-muted-foreground" aria-label="Notifications"><Bell className="size-4" /><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-warning ring-2 ring-background" /></Button>
          {notifyOpen && <div className="absolute right-0 top-10 z-50 w-[284px] rounded-md border border-border bg-popover p-4 shadow-lg"><div className="flex items-center justify-between"><span className="text-sm font-semibold">Notifications</span><TagBadge>Preview</TagBadge></div><p className="mt-2.5 text-xs leading-5 text-muted-foreground">There are no live alerts in this preview workspace.</p><div className="mt-3 border-t border-border pt-3 text-[11px] text-muted-foreground">Scheduled and source notifications are not connected.</div></div>}
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={onToggleTheme} className="size-8 text-muted-foreground" aria-label={isDark ? "Use light theme" : "Use dark theme"} title={isDark ? "Use light theme" : "Use dark theme"}>{isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}</Button>
        <div className="hidden items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground md:flex"><span className="size-1.5 rounded-full bg-warning" />Preview only</div>
        <div className="flex size-8 items-center justify-center rounded-full bg-brand-soft text-[10px] font-bold text-brand" aria-label="Alex Kim profile">AK</div>
      </div>
    </header>
  );
}

function CompanyPicker({ company, onChange }: { company: CompanyName; onChange: (name: CompanyName) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <Button type="button" variant="outline" size="sm" aria-expanded={open} aria-label="Select company" onClick={() => setOpen((current) => !current)} className="h-9 gap-2 border-border bg-card px-2.5 text-[11px] font-medium sm:px-3"><Building2 className="size-3.5 text-muted-foreground" /><span className="max-w-[125px] truncate">{company}</span><ChevronDown className="size-3 text-muted-foreground" /></Button>
      {open && <div className="absolute left-0 top-11 z-50 w-[230px] rounded-md border border-border bg-popover p-1.5 shadow-lg">{companies.map((item) => <button key={item.name} type="button" onClick={() => { onChange(item.name); setOpen(false); toast.message(`${item.name} preview selected`); }} className="flex w-full cursor-pointer items-center gap-2.5 rounded-sm px-2 py-2 text-left hover:bg-accent"><span className="grid size-7 place-items-center rounded bg-brand-soft text-[9px] font-bold text-brand">{item.monogram}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold">{item.name}</span><span className="block text-[10px] text-muted-foreground">Illustrative company preview</span></span>{company === item.name && <Check className="size-3.5 text-success" />}</button>)}</div>}
    </div>
  );
}

function DemoLabel() {
  return <div className="mb-6 flex items-start gap-2 rounded-md border border-warning/25 bg-warning-soft/50 px-3.5 py-3 text-warning"><Sparkles className="mt-0.5 size-3.5 shrink-0" /><p className="text-[11px] leading-[1.6]"><span className="font-semibold">Illustrative preview data.</span> Names, signals, counts and health labels below are examples only. No live source checks, research, scheduling or AI processing are running.</p></div>;
}

function OverviewPage({ company, onNavigate }: { company: CompanyName; onNavigate: (page: Section) => void }) {
  const firstSignals = previewSignals;
  return (
    <>
      <PageHeading page="overview" action={<div className="flex flex-wrap items-center gap-2"><PreviewNotice /><Button onClick={() => onNavigate("brief")} size="sm" className="h-9 gap-2 px-3 text-xs"><BookOpen className="size-3.5" />Open brief</Button></div>} />
      <DemoLabel />
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Example sources" value="06" description="Preview records · none connected" icon={Globe2} tone="brand" />
        <MetricCard label="Signal themes" value="03" description="Illustrative examples · unverified" icon={Radio} tone="cyan" />
        <MetricCard label="Source reviews" value="02" description="Example review labels · not live" icon={ShieldCheck} tone="warning" />
        <MetricCard label="Next brief" value="—" description="Scheduling is not configured" icon={CalendarClock} tone="success" />
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
        <section className="signal-panel p-5 sm:p-6">
          <PanelHeading title="Developments to consider" detail={`Illustrative themes for ${company} · not collected intelligence`} action={<Button type="button" variant="ghost" size="sm" onClick={() => onNavigate("feed")} className="h-8 gap-1 text-[11px]">View feed<ArrowRight className="size-3" /></Button>} />
          <div>{firstSignals.map((signal) => <SignalRow key={signal.category} signal={signal} />)}</div>
        </section>
        <section className="signal-panel p-5 sm:p-6">
          <PanelHeading title="Workspace readiness" detail="Example configuration · not a live system status" />
          <div className="flex items-center gap-3 rounded-md bg-warning-soft/70 p-3"><span className="grid size-9 place-items-center rounded-md bg-warning-soft text-warning"><CircleHelp className="size-4" /></span><div><div className="text-xs font-semibold">Preview workspace</div><div className="mt-1 text-[11px] text-muted-foreground">Connect a research service to verify sources.</div></div></div>
          <div className="mt-4 space-y-3.5">
            {[{ label: "Company context", percent: 42, copy: "Example profile" }, { label: "Source selection", percent: 68, copy: "Illustrative sources" }, { label: "Monitoring", percent: 0, copy: "Not connected" }].map((item) => <div key={item.label}><div className="mb-1.5 flex justify-between gap-2 text-[11px]"><span className="font-medium">{item.label}</span><span className="text-muted-foreground">{item.copy}</span></div><Progress value={item.percent} className="h-1.5 bg-secondary [&>div]:bg-primary" /></div>)}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => onNavigate("setup")} className="mt-5 h-8 gap-1.5 text-[11px]"><Building2 className="size-3.5" />Review company setup</Button>
        </section>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <section className="signal-panel p-5 sm:p-6"><PanelHeading title="Source health" detail="Preview labels only · no checks have run" action={<Button type="button" variant="ghost" size="sm" onClick={() => onNavigate("sources")} className="h-8 text-[11px]">Source manager<ArrowRight className="size-3" /></Button>} />{previewSources.slice(0, 4).map((source) => <SourceMiniRow key={source.name} source={source} />)}</section>
        <section className="signal-panel p-5 sm:p-6"><PanelHeading title="Latest Monday brief" detail="Illustrative report · no real intelligence" /><div className="rounded-md bg-brand-soft/60 p-4"><div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-brand"><FileText className="size-3.5" />Editorial preview</div><h3 className="signal-display mt-3 text-[16px] font-bold">A clearer view of what matters next.</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">A structured ten-section layout awaits verified source evidence and company context.</p><div className="mt-4 flex items-center justify-between border-t border-brand/10 pt-3 text-[10px] text-muted-foreground"><span>10 sections · Preview template</span><Button type="button" variant="ghost" size="sm" onClick={() => onNavigate("brief")} className="h-7 gap-1 px-2 text-[10px] text-brand">Read preview<ArrowRight className="size-3" /></Button></div></div><div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground"><Clock3 className="size-3.5" />No activities are scheduled or running.</div></section>
      </div>
    </>
  );
}

function SetupPage({ company }: { company: CompanyName }) {
  const [name, setName] = useState(company);
  const [url, setUrl] = useState(`https://${companies.find((entry) => entry.name === company)?.domain}`);
  const [prepared, setPrepared] = useState(false);
  useEffect(() => { setName(company); const match = companies.find((entry) => entry.name === company); if (match) setUrl(`https://${match.domain}`); setPrepared(false); }, [company]);
  return <>
    <PageHeading page="setup" action={<PreviewNotice />} /><DemoLabel />
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(290px,0.7fr)]">
      <section className="signal-panel p-5 sm:p-7"><PanelHeading title="Company details" detail="Saved only in this browser preview." />
        <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); setPrepared(true); toast.message("Setup captured in this preview", { description: "No research was run or saved to a service." }); }}>
          <label className="block space-y-1.5 text-xs font-medium">Company name<Input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} placeholder="e.g. MeetUniversity" className="mt-1 h-10 bg-background text-sm" /></label>
          <label className="block space-y-1.5 text-xs font-medium">Company website<Input type="url" value={url} onChange={(event) => setUrl(event.target.value)} required placeholder="https://example.com" className="mt-1 h-10 bg-background text-sm" /></label>
          <Button type="submit" className="h-10 gap-2 px-4 text-xs"><Compass className="size-4" />Prepare research preview</Button>
        </form>
        {prepared && <div role="status" className="mt-5 rounded-md border border-warning/25 bg-warning-soft/50 p-4"><div className="flex gap-2 text-xs font-semibold text-warning"><CircleHelp className="size-4" />Preview only — no research was performed</div><p className="mt-2 text-xs leading-5 text-muted-foreground">The setup details are held in this page state. Connect a research service to look up {name || "this company"} using {url || "its website"}.</p></div>}
      </section>
      <section className="signal-panel p-5 sm:p-6"><PanelHeading title="Research flow" detail="A preview of the future workflow" /><div className="space-y-0">{[{ title: "Company basics", detail: "Name and website", icon: Building2 }, { title: "Public context", detail: "Products, audiences and positioning", icon: Globe2 }, { title: "Evidence review", detail: "Facts kept separate from assumptions", icon: ShieldCheck }, { title: "Founder context", detail: "Ten questions, one at a time", icon: MessageSquareText }].map((item, index) => <div key={item.title} className="relative flex gap-3 pb-5 last:pb-0"><div className="relative z-10 grid size-8 shrink-0 place-items-center rounded-md bg-secondary text-muted-foreground"><item.icon className="size-3.5" /></div>{index < 3 && <span className="absolute left-4 top-9 h-[calc(100%-16px)] w-px bg-border" />}<div><div className="text-xs font-semibold">{item.title}</div><div className="mt-1 text-[11px] text-muted-foreground">{item.detail}</div><span className="mt-1.5 inline-block text-[9px] font-semibold text-warning">NOT RUNNING</span></div></div>)}</div></section>
    </div>
  </>;
}

function ResearchPage({ company }: { company: CompanyName }) {
  const facts = company === "EDXSO"
    ? [{ label: "Publicly stated focus", text: "Supports schools and education leaders with diagnostic, strategy and implementation work.", evidence: "EDXSO public website" }, { label: "Audience", text: "School principals, academic heads, school management and education entrepreneurs.", evidence: "EDXSO public website" }, { label: "Positioning", text: "Frames its work around practical institutional growth and measurable academic impact.", evidence: "EDXSO public website" }]
    : [{ label: "Company profile", text: `An example company workspace for ${company}; details have not been researched in this preview.`, evidence: "Illustrative preview, not independently verified" }, { label: "Products & services", text: "Service lines and user workflows need to be confirmed against public sources.", evidence: "Research not connected" }, { label: "Customer segments", text: "Potential audiences are placeholders; validate before using in a decision.", evidence: "Assumption to investigate" }];
  return <>
    <PageHeading page="research" action={<PreviewNotice />} /><DemoLabel />
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(270px,0.7fr)]">
      <div className="space-y-4"><section className="signal-panel p-5 sm:p-6"><div className="mb-4 flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-md bg-brand-soft text-brand"><Building2 className="size-5" /></span><div className="min-w-0 flex-1"><h2 className="signal-display text-lg font-bold">{company}</h2><p className="mt-1 text-xs text-muted-foreground">{companies.find((entry) => entry.name === company)?.domain} · Research preview</p></div><TagBadge className="bg-warning-soft text-warning">Unverified</TagBadge></div><p className="text-sm leading-6 text-muted-foreground">{company === "EDXSO" ? "The public website describes a partnership focused on understanding school challenges, designing practical strategies and supporting implementation for sustainable institutional growth." : `This workspace shows how a company research profile could be organized for ${company}. No company research has been fetched.`}</p></section>
        <section className="signal-panel p-5 sm:p-6"><PanelHeading title="Research notes" detail="Evidence and interpretation stay separate." /><div className="space-y-3">{facts.map((fact, index) => <article key={fact.label} className="rounded-md border border-border/80 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="text-xs font-semibold">{fact.label}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{fact.text}</p></div><TagBadge className={index === 0 && company === "EDXSO" ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}>{index === 0 && company === "EDXSO" ? "Public statement" : "To verify"}</TagBadge></div><div className="mt-3 flex items-center gap-1.5 border-t border-border/70 pt-2.5 text-[10px] text-muted-foreground"><FileText className="size-3" />{fact.evidence}</div></article>)}</div></section></div>
      <div className="space-y-4"><section className="signal-panel p-5"><PanelHeading title="Research coverage" detail="Preview only" />{[{ label: "Products & services", done: false }, { label: "Business model", done: false }, { label: "Customer segments", done: false }, { label: "Competitive context", done: false }].map((item) => <div className="flex items-center gap-2.5 border-b border-border/70 py-3 last:border-0" key={item.label}><span className="size-4 rounded-full border border-border" /><span className="flex-1 text-[11px]">{item.label}</span><span className="text-[9px] text-muted-foreground">Not researched</span></div>)}</section><section className="signal-panel border-warning/20 p-5"><div className="flex gap-2.5"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-warning" /><div><h3 className="text-xs font-semibold">Verification boundary</h3><p className="mt-1.5 text-[11px] leading-5 text-muted-foreground">Only public statements from EDXSO’s website were reviewed. Other company details and every live intelligence claim remain unverified.</p></div></div></section></div>
    </div>
  </>;
}

function InterviewPage({ company }: { company: CompanyName }) {
  const questions = questionsByCompany[company];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [skipped, setSkipped] = useState<number[]>([]);
  const [showProfile, setShowProfile] = useState(true);
  useEffect(() => { setStep(0); setAnswers({}); setSkipped([]); }, [company]);
  const finishStep = (next: number) => { setStep(Math.min(questions.length - 1, Math.max(0, next))); };
  return <>
    <PageHeading page="interview" action={<PreviewNotice>Local-only answers · no interview service</PreviewNotice>} /><DemoLabel />
    <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
      <section className="signal-panel p-5 sm:p-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">Founder conversation</span><h2 className="signal-display mt-1.5 text-lg font-bold">{company}</h2></div><TagBadge className="bg-brand-soft text-brand">Question {step + 1} of 10</TagBadge></div>
        <Progress value={(step + 1) * 10} aria-label={`Question ${step + 1} of 10`} className="mb-6 h-1.5 bg-secondary [&>div]:bg-primary" />
        <div className="rounded-md bg-brand-soft/45 p-5 sm:p-6"><div className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-brand"><MessageSquareText className="size-3.5" />Business context</div><h3 className="signal-display max-w-2xl text-[18px] font-semibold leading-[1.55] sm:text-[21px]">{questions[step]}</h3><p className="mt-3 text-xs leading-5 text-muted-foreground">Consider what makes this important to your company and what evidence would support the answer.</p></div>
        <label className="mt-5 block text-xs font-medium" htmlFor="interview-answer">Your answer<textarea id="interview-answer" value={answers[step] ?? ""} onChange={(event) => setAnswers((current) => ({ ...current, [step]: event.target.value }))} maxLength={1400} placeholder="Add company context for this preview…" className="mt-2 min-h-[125px] w-full resize-y rounded-md border border-input bg-background px-3 py-2.5 text-sm leading-6 shadow-sm placeholder:text-muted-foreground/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" /></label>
        <div className="mt-2 flex items-start gap-2 text-[10px] leading-4 text-muted-foreground"><LockKeyhole className="mt-0.5 size-3 shrink-0" />Answers stay in this page state and are not saved or sent.</div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4"><Button type="button" variant="outline" size="sm" onClick={() => finishStep(step - 1)} disabled={step === 0} className="h-9 gap-1.5 px-3 text-xs"><ChevronLeft className="size-3.5" />Previous</Button><div className="flex flex-wrap gap-2"><Button type="button" variant="ghost" size="sm" onClick={() => { setSkipped((current) => current.includes(step) ? current : [...current, step]); toast.message("Question skipped for this preview."); finishStep(step + 1); }} className="h-9 px-3 text-xs">Skip sensitive</Button><Button type="button" size="sm" onClick={() => { toast.message(answers[step] ? "Answer kept in this page state." : "You can add an answer or continue.", { description: "Nothing has been sent to a service." }); finishStep(step + 1); }} className="h-9 gap-1.5 px-3 text-xs">{step === questions.length - 1 ? "Finish preview" : "Save & continue"}<ChevronRight className="size-3.5" /></Button></div></div>
      </section>
      <aside className="signal-panel overflow-hidden"><div className="flex items-center justify-between border-b border-border p-4"><div><h2 className="text-xs font-semibold">Live profile preview</h2><p className="mt-1 text-[10px] text-muted-foreground">Updated as you answer · local only</p></div><Button type="button" variant="ghost" size="icon" onClick={() => setShowProfile((show) => !show)} className="size-8 text-muted-foreground" aria-label={showProfile ? "Collapse profile preview" : "Expand profile preview"}><ChevronDown className={`size-4 transition-transform ${showProfile ? "" : "-rotate-90"}`} /></Button></div>{showProfile && <div className="p-4"><div className="mb-4 rounded-md bg-secondary/70 p-3"><div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground">Interview progress</span><span className="text-[11px] font-semibold">{Object.keys(answers).length + skipped.length} / 10</span></div><Progress value={(Object.keys(answers).length + skipped.length) * 10} className="mt-2 h-1.5 bg-background [&>div]:bg-primary" /></div><div className="space-y-3">{[{ title: "Business model", key: 0 }, { title: "Customer priorities", key: 1 }, { title: "Growth goals", key: 6 }, { title: "Founder decisions", key: 9 }].map((item) => <div key={item.key} className="border-b border-border/70 pb-3 last:border-0"><div className="text-[10px] font-semibold">{item.title}</div><p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-muted-foreground">{answers[item.key] || "Your answer will appear here."}</p></div>)}</div><div className="mt-2 text-[9px] text-warning">Draft profile only · not saved</div></div>}</aside>
    </div>
  </>;
}

function ProfilePage({ company }: { company: CompanyName }) {
  const profile = [{ label: "Business model", value: "Clarify primary offerings, revenue streams and delivery model.", icon: Target }, { label: "Customer segments", value: "Identify the teams or communities that benefit most.", icon: Building2 }, { label: "Customer problems", value: "Capture needs, friction points and unmet expectations.", icon: MessageSquareText }, { label: "Value proposition", value: "Document why the right-fit customer chooses this company.", icon: Sparkles }, { label: "Competitors & alternatives", value: "Map companies, substitute services and the status quo.", icon: Layers3 }, { label: "Growth priorities", value: "Define the outcomes leadership wants to move this year.", icon: ArrowUpRight }, { label: "Internal context", value: "Add relevant feedback or confidential business context when connected.", icon: LockKeyhole }];
  return <><PageHeading page="profile" action={<Button type="button" variant="outline" size="sm" onClick={() => toast.message("Version history is a preview-only panel.")} className="h-9 gap-2 px-3 text-xs"><FileClock className="size-3.5" />Version history</Button>} /><DemoLabel /><section className="signal-panel mb-4 flex flex-wrap items-center gap-3 p-4 sm:p-5"><span className="grid size-10 place-items-center rounded-md bg-brand-soft text-brand"><Building2 className="size-4.5" /></span><div className="min-w-0 flex-1"><h2 className="text-sm font-semibold">{company}</h2><p className="mt-1 text-[11px] text-muted-foreground">Example profile fields · no interview answers have been saved</p></div><TagBadge className="bg-warning-soft text-warning">Draft preview</TagBadge><Button type="button" variant="outline" size="sm" onClick={() => toast.message("Edits are not saved in this preview.")} className="h-8 gap-1.5 text-[11px]">Edit profile<ArrowRight className="size-3" /></Button></section><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{profile.map((item, index) => <section key={item.label} className="signal-panel signal-panel-hover p-4 sm:p-5"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2.5"><span className="grid size-8 place-items-center rounded-md bg-secondary text-muted-foreground"><item.icon className="size-4" /></span><h3 className="text-xs font-semibold">{item.label}</h3></div><Button type="button" variant="ghost" size="icon" onClick={() => toast.message(`${item.label} preview field is not saved.`)} aria-label={`Edit ${item.label}`} className="size-7 text-muted-foreground"><MoreHorizontal className="size-4" /></Button></div><p className="mt-4 min-h-[40px] text-[11px] leading-[1.7] text-muted-foreground">{item.value}</p><div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3"><span className="text-[9px] text-muted-foreground">{index === 6 ? "Private context" : "Company context"}</span><TagBadge className="bg-muted text-muted-foreground">{index === 0 ? "To confirm" : "Not set"}</TagBadge></div></section>)}</div></>;
}

function SignalStackPage() {
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("Customers");
  const [sourceStatus, setSourceStatus] = useState<Record<string, PreviewSource["status"]>>({});
  const visibleSources = previewSources.filter((source) => source.category === selectedCategory);
  return <><PageHeading page="signals" action={<PreviewNotice />} /><DemoLabel />
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border"><div role="tablist" aria-label="Signal Stack categories" className="flex gap-1 overflow-x-auto">{categories.map((category) => <button type="button" role="tab" aria-selected={selectedCategory === category} key={category} onClick={() => setSelectedCategory(category)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-xs font-medium transition-colors ${selectedCategory === category ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{category}<span className="ml-2 rounded-full bg-secondary px-1.5 py-0.5 text-[9px]">{previewSources.filter((source) => source.category === category).length}</span></button>)}</div><Button type="button" variant="outline" size="sm" onClick={() => toast.message("Source discovery is not connected; this preview makes no new recommendations.")} className="h-8 gap-1.5 text-[11px]"><Sparkles className="size-3.5" />Preview discovery</Button></div>
    <div role="tabpanel" className="grid gap-3 lg:grid-cols-2">{visibleSources.length ? visibleSources.map((source) => <article key={source.name} className="signal-panel signal-panel-hover p-4 sm:p-5"><div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-md bg-brand-soft text-brand"><Globe2 className="size-4" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-[13px] font-semibold">{source.name}</h3><CategoryTag category={source.category} /></div><a href={source.url.startsWith("Internal") ? undefined : `https://${source.url}`} target="_blank" rel="noreferrer" className="mt-1 block truncate text-[11px] text-brand hover:underline">{source.url}<ExternalLink className="ml-1 inline size-3" /></a></div><Button type="button" variant="ghost" size="icon" aria-label={`Inspect ${source.name}`} onClick={() => toast.message(`${source.name}: illustrative source detail, not inspected live.`)} className="size-8 text-muted-foreground"><Eye className="size-4" /></Button></div><p className="mt-4 text-xs leading-[1.7] text-muted-foreground">{source.rationale}</p><div className="mt-4 grid grid-cols-2 gap-3 rounded-md bg-secondary/55 p-3 sm:grid-cols-4">{[{ label: "Specificity", value: `${source.specificity}%` }, { label: "Credibility", value: `${source.credibility}%` }, { label: "Recency", value: source.recency }, { label: "Health", value: source.health }].map((item) => <div key={item.label}><div className="text-[9px] text-muted-foreground">{item.label}</div><div className="mt-1 text-[10px] font-semibold">{item.value}</div></div>)}</div><div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3"><StateTag label={sourceStatus[source.name] === "Approved" ? "Approved" : sourceStatus[source.name] === "Rejected" ? "Rejected" : source.status} /><div className="flex gap-1.5"><Button type="button" variant="outline" size="sm" onClick={() => { setSourceStatus((current) => ({ ...current, [source.name]: "Rejected" })); toast.message("Marked as rejected in this preview."); }} className="h-7 px-2.5 text-[10px]">Reject</Button><Button type="button" size="sm" onClick={() => { setSourceStatus((current) => ({ ...current, [source.name]: "Approved" })); toast.message("Marked as approved in this preview.", { description: "No source check has been started." }); }} className="h-7 gap-1 px-2.5 text-[10px]"><Check className="size-3" />Approve</Button></div></div></article>) : <div className="signal-panel col-span-full p-8 text-center"><Layers3 className="mx-auto size-6 text-muted-foreground" /><h3 className="mt-3 text-sm font-semibold">No example sources in this category</h3><p className="mt-1 text-xs text-muted-foreground">This is an intentional empty preview; no sources have been discovered.</p></div>}</div>
  </>;
}

function AddSourceDialog({ open, onOpenChange, onAdd }: { open: boolean; onOpenChange: (open: boolean) => void; onAdd: (source: PreviewSource) => void }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<PreviewSource["category"]>("Customers");
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
    onAdd({ name, url: normalized, category, rationale: "Added manually to this temporary preview list; relevance and credibility have not been assessed.", specificity: 0, credibility: 0, recency: "Not checked", health: "New", status: "Pending", type: "News" });
    setName(""); setUrl(""); onOpenChange(false);
  }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]"><DialogHeader><DialogTitle>Add a source</DialogTitle><DialogDescription>This adds an unverified example entry to the current page only. It does not start a source check.</DialogDescription></DialogHeader><form onSubmit={submit} className="space-y-4 py-1"><label className="block space-y-1.5 text-xs font-medium">Source name<Input required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Industry publication" className="mt-1 h-10" /></label><label className="block space-y-1.5 text-xs font-medium">Website URL<Input required type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com" className="mt-1 h-10" /></label><label className="block space-y-1.5 text-xs font-medium">Intelligence category<select value={category} onChange={(event) => setCategory(event.target.value as PreviewSource["category"])} className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-xs"><option>Customers</option><option>Competitors</option><option>Market</option><option>Internal</option></select></label><DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit"><Plus className="size-4" />Add to preview</Button></DialogFooter></form></DialogContent></Dialog>;
}

function SourcesPage({ sources, setSources }: { sources: PreviewSource[]; setSources: React.Dispatch<React.SetStateAction<PreviewSource[]>> }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const visibleSources = sources.filter((source) => `${source.name} ${source.url}`.toLowerCase().includes(search.toLowerCase()) && (category === "All categories" || source.category === category));
  const addSource = (source: PreviewSource) => { setSources((current) => [source, ...current]); toast.message("Example source added to this page.", { description: "No service was contacted and no live check was run." }); };
  return <><PageHeading page="sources" action={<div className="flex gap-2"><Button type="button" variant="outline" size="sm" onClick={() => setHistoryOpen(true)} className="h-9 gap-1.5 text-xs"><FileClock className="size-3.5" /><span className="hidden sm:inline">History</span></Button><Button type="button" size="sm" onClick={() => setDialogOpen(true)} className="h-9 gap-1.5 text-xs"><Plus className="size-3.5" />Add source</Button></div>} /><DemoLabel />
    <section className="signal-panel overflow-hidden"><div className="flex flex-wrap items-center gap-2 border-b border-border p-4"><div className="relative min-w-[175px] flex-1 sm:max-w-[290px]"><Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search sources" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search sources" className="h-9 pl-8 text-xs" /></div><select aria-label="Filter sources by category" value={category} onChange={(event) => setCategory(event.target.value)} className="h-9 rounded-md border border-input bg-background px-2.5 text-[11px]"><option>All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select><Button type="button" variant="outline" size="sm" onClick={() => toast.message("Filters applied to preview entries.")} className="h-9 gap-1.5 text-[11px]"><SlidersHorizontal className="size-3.5" />Filter</Button><span className="ml-auto text-[10px] text-muted-foreground">{visibleSources.length} example sources</span></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[840px] text-left text-xs"><thead className="bg-secondary/60 text-[10px] font-semibold text-muted-foreground"><tr>{["SOURCE", "CATEGORY", "TYPE", "RELEVANCE", "CREDIBILITY", "LAST CHECK", "HEALTH", "STATUS", "ACTIONS"].map((label) => <th key={label} className="px-3 py-3 first:pl-5">{label}</th>)}</tr></thead><tbody>{visibleSources.map((source) => <tr key={`${source.name}-${source.url}`} className="border-t border-border/70 transition-colors hover:bg-secondary/30"><td className="max-w-[190px] py-3 pl-5 pr-2"><div className="truncate font-semibold">{source.name}</div><div className="mt-1 truncate text-[10px] text-muted-foreground">{source.url}</div></td><td className="px-3"><CategoryTag category={source.category} /></td><td className="px-3 text-muted-foreground">{source.type}</td><td className="px-3 tabular-nums">{source.specificity ? `${source.specificity}%` : "—"}</td><td className="px-3 tabular-nums">{source.credibility ? `${source.credibility}%` : "—"}</td><td className="px-3 text-[10px] text-muted-foreground">{source.recency}</td><td className="px-3"><StateTag label={source.health} /></td><td className="px-3"><StateTag label={source.status} /></td><td className="px-3 pr-4"><Button type="button" variant="ghost" size="icon" onClick={() => toast.message("Source details are not connected in this preview.")} aria-label={`Open ${source.name} actions`} className="size-8"><MoreHorizontal className="size-4" /></Button></td></tr>)}</tbody></table>{visibleSources.length === 0 && <div className="px-5 py-10 text-center text-xs text-muted-foreground">No sources match this filter.</div>}</div><div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-[10px] text-muted-foreground"><span>Example catalogue · no source checks have run</span><span className="inline-flex items-center gap-1"><LockKeyhole className="size-3" />No external connections</span></div></section>
    <AddSourceDialog open={dialogOpen} onOpenChange={setDialogOpen} onAdd={addSource} />
    <Dialog open={historyOpen} onOpenChange={setHistoryOpen}><DialogContent><DialogHeader><DialogTitle>Source history</DialogTitle><DialogDescription>History is unavailable because this preview has not checked or changed a real source.</DialogDescription></DialogHeader><div className="rounded-md border border-border bg-secondary/50 p-4 text-xs leading-5 text-muted-foreground">No crawls, source changes or historical checks are recorded here.</div></DialogContent></Dialog>
  </>;
}

function FeedPage() {
  const [category, setCategory] = useState("All categories");
  const [type, setType] = useState("All signals");
  const [search, setSearch] = useState("");
  const signals = previewSignals.filter((signal) => (category === "All categories" || signal.category === category) && (type === "All signals" || signal.type === type) && `${signal.event} ${signal.why} ${signal.source}`.toLowerCase().includes(search.toLowerCase()));
  return <><PageHeading page="feed" action={<Button type="button" variant="outline" size="sm" onClick={() => { setCategory("All categories"); setType("All signals"); setSearch(""); }} className="h-9 gap-1.5 text-xs"><RefreshCw className="size-3.5" />Reset filters</Button>} /><DemoLabel /><section className="signal-panel mb-4 p-3.5"><div className="flex flex-wrap items-center gap-2"><div className="relative min-w-[180px] flex-1"><Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search signals" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a signal" className="h-9 pl-8 text-xs" /></div><select aria-label="Filter by category" value={category} onChange={(event) => setCategory(event.target.value)} className="h-9 rounded-md border border-input bg-background px-2.5 text-[11px]"><option>All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select><select aria-label="Filter by signal type" value={type} onChange={(event) => setType(event.target.value)} className="h-9 rounded-md border border-input bg-background px-2.5 text-[11px]"><option>All signals</option><option>Opportunity</option><option>Threat</option><option>Neutral</option></select><span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"><Filter className="size-3.5" />{signals.length} example items</span></div></section>
    <div className="space-y-3">{signals.map((signal, index) => <article key={signal.category} className="signal-panel p-4 sm:p-5"><div className="flex items-start gap-3"><div className="flex w-7 shrink-0 flex-col items-center"><span className="size-2.5 rounded-full bg-brand ring-4 ring-brand-soft" />{index < signals.length - 1 && <span className="mt-2 min-h-[34px] w-px flex-1 bg-border" />}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><CategoryTag category={signal.category as (typeof categories)[number]} /><StateTag label={signal.type as keyof typeof statusClasses} /><TagBadge className="bg-muted text-muted-foreground">{signal.urgency} urgency · illustrative</TagBadge><span className="ml-auto text-[10px] text-muted-foreground">{signal.date}</span></div><h2 className="mt-3 text-sm font-semibold leading-6">{signal.event}</h2><div className="mt-3 grid gap-3 sm:grid-cols-2"><div className="rounded-md bg-secondary/55 p-3"><div className="text-[9px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Why it matters · interpretation</div><p className="mt-1.5 text-[11px] leading-[1.7]">{signal.why}</p></div><div className="rounded-md bg-secondary/55 p-3"><div className="text-[9px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Evidence · illustrative only</div><p className="mt-1.5 text-[11px] leading-[1.7] text-muted-foreground">No source article or direct evidence is attached to this placeholder example.</p></div></div><div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3 text-[10px] text-muted-foreground"><span className="inline-flex items-center gap-1.5"><FileText className="size-3.5" />{signal.source}</span><span>Publication date: — · discovered: —</span></div><Button type="button" variant="ghost" size="sm" onClick={() => toast.message("No recommendation is generated for illustrative records.")} className="mt-1 h-7 gap-1 px-1.5 text-[10px] text-brand">Review recommended action<ArrowRight className="size-3" /></Button></div></div></article>)}{signals.length === 0 && <div className="signal-panel p-10 text-center"><ListFilter className="mx-auto size-6 text-muted-foreground" /><h3 className="mt-3 text-sm font-semibold">No matching preview signals</h3><p className="mt-1 text-xs text-muted-foreground">Try broadening or resetting the filters.</p></div>}</div>
  </>;
}

function BriefPage({ company }: { company: CompanyName }) {
  const [checked, setChecked] = useState<number[]>([]);
  const [activeSection, setActiveSection] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const items = [
    `This editorial template shows how to frame a short decision-oriented update for ${company}. No new or verified developments are included.`,
    "Describe recurring customer needs only after they are supported by current, traceable evidence.",
    "Compare material competitor changes and explain their potential relevance without asserting unverified activity.",
    "Separate dated education-sector policy updates from general sector commentary.",
    "No internal conversations, CRM exports or company materials are connected in this preview.",
    "Illustrative possibility: review whether clearer decision-support information could help address a confirmed user need.",
    "No verified threats are presented in this sample report. Add a risk only when evidence supports it.",
    "Replace the example checklist with evidence-backed actions, named owners and confirmed priorities.",
    "Monitor for dated public notices and decision barriers once approved sources are connected.",
    "Evidence links, publication dates, discovery dates and verification states are intentionally omitted from this preview." ];
  const actionSections = new Set([5, 6, 7, 8]);
  return <><PageHeading page="brief" action={<div className="flex gap-2"><Button type="button" variant="outline" size="sm" onClick={() => setHistoryOpen(true)} className="h-9 gap-1.5 text-xs"><FileClock className="size-3.5" /><span className="hidden sm:inline">History</span></Button><Button type="button" variant="outline" size="sm" onClick={() => window.print()} className="h-9 gap-1.5 text-xs"><Printer className="size-3.5" /><span className="hidden sm:inline">Print / PDF</span></Button></div>} /><DemoLabel />
    <section className="signal-panel mb-5 p-4 sm:p-5"><div className="flex flex-wrap items-center gap-3"><span className="grid size-10 place-items-center rounded-md bg-brand-soft text-brand"><BookOpen className="size-5" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="signal-display text-[16px] font-bold">The Monday briefing</h2><TagBadge className="bg-warning-soft text-warning">Preview template</TagBadge></div><p className="mt-1 text-[11px] text-muted-foreground">{company} · Example report only · no source-backed intelligence</p></div><Button type="button" variant="outline" size="sm" onClick={() => toast.message("Email-ready export is a visual preview only.")} className="h-8 gap-1.5 text-[10px]"><Send className="size-3.5" />Email layout</Button></div></section>
    <div className="grid items-start gap-5 xl:grid-cols-[200px_minmax(0,760px)] xl:justify-center">
      <aside className="signal-panel sticky top-[82px] hidden p-3 xl:block"><SectionLabel>In this brief</SectionLabel><nav aria-label="Brief contents" className="space-y-0.5">{briefSections.map((section, index) => <a key={section} href={`#brief-section-${index}`} onClick={() => setActiveSection(index)} className={`flex items-center gap-2 rounded px-2 py-2 text-[10px] leading-4 transition-colors hover:bg-accent ${activeSection === index ? "bg-brand-soft font-semibold text-brand" : "text-muted-foreground"}`}><span className="w-4 shrink-0 font-mono text-[9px]">{String(index + 1).padStart(2, "0")}</span><span>{section}</span></a>)}</nav><div className="mt-3 border-t border-border pt-3 text-[9px] leading-4 text-muted-foreground">Ten sections · evidence awaits a live source connection.</div></aside>
      <article className="signal-panel min-w-0 overflow-hidden"><div className="border-b border-border px-5 py-6 sm:px-8"><div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-brand">SIGNAL STACK · EDITORIAL PREVIEW</div><h2 className="signal-display mt-3 text-[24px] font-bold leading-tight">Monday Morning Brief</h2><p className="mt-2 text-xs text-muted-foreground">{company} · Illustrative layout · No publication date</p><div className="mt-4 rounded-md border border-warning/20 bg-warning-soft/45 p-3 text-[10px] leading-5 text-warning">This is a format preview, not an intelligence report. Developments, evidence links, dates, confidence and owner assignments have not been generated.</div></div><div className="divide-y divide-border/80 px-5 sm:px-8">{briefSections.map((section, index) => <section id={`brief-section-${index}`} key={section} onMouseEnter={() => setActiveSection(index)} className="scroll-mt-24 py-6 first:pt-6"><div className="flex items-baseline gap-3"><span className="font-mono text-[10px] font-semibold text-brand">{String(index + 1).padStart(2, "0")}</span><h3 className="signal-display text-[15px] font-bold">{section}</h3>{actionSections.has(index) && <TagBadge className="bg-muted text-muted-foreground">Action area</TagBadge>}</div><p className="mt-3 text-xs leading-[1.8] text-muted-foreground">{items[index]}</p>{index === 0 && <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">{[{ name: "Customer insight", icon: MessageSquareText }, { name: "Market context", icon: Globe2 }, { name: "Leadership decision", icon: Target }].map((card) => <div key={card.name} className="flex items-center gap-2 rounded-md bg-secondary/55 p-3 text-[10px]"><card.icon className="size-3.5 text-muted-foreground" />{card.name}</div>)}</div>}{index === 7 && <div className="mt-4 space-y-2">{["Confirm a decision priority", "Review source relevance", "Assign a follow-up owner"].map((action, actionIndex) => <label key={action} className="flex cursor-pointer items-start gap-2.5 rounded-md border border-border/80 p-3 text-[11px] leading-5"><input type="checkbox" checked={checked.includes(actionIndex)} onChange={() => setChecked((current) => current.includes(actionIndex) ? current.filter((value) => value !== actionIndex) : [...current, actionIndex])} className="mt-1 size-3.5 accent-primary" /><span className={checked.includes(actionIndex) ? "text-muted-foreground line-through" : ""}>{action} <span className="ml-1 text-[9px] text-muted-foreground">· example only</span></span><span className="ml-auto shrink-0 text-[9px] text-muted-foreground">Owner not assigned</span></label>)}</div>}{index === 9 && <div className="mt-4 overflow-x-auto rounded-md border border-border"><table className="min-w-[470px] w-full text-left text-[10px]"><thead className="bg-secondary/50 text-muted-foreground"><tr>{["SOURCE", "PUBLICATION", "DISCOVERED", "STATUS"].map((heading) => <th key={heading} className="p-2.5 font-semibold">{heading}</th>)}</tr></thead><tbody><tr><td colSpan={4} className="p-4 text-center text-muted-foreground">No real source citations are attached to this example report.</td></tr></tbody></table></div>}</section>)}</div><div className="border-t border-border bg-secondary/40 px-5 py-4 text-center text-[10px] text-muted-foreground sm:px-8">Signal Stack · Preview layout · Do not use as business intelligence</div></article>
    </div>
    <Dialog open={historyOpen} onOpenChange={setHistoryOpen}><DialogContent><DialogHeader><DialogTitle>Brief history</DialogTitle><DialogDescription>No briefs have been generated, scheduled or archived for this preview.</DialogDescription></DialogHeader></DialogContent></Dialog>
  </>;
}

function AutomationPage() {
  const [weekly, setWeekly] = useState(false);
  const [monthly, setMonthly] = useState(false);
  return <><PageHeading page="automation" /><DemoLabel /><div className="grid gap-4 lg:grid-cols-2">{[{ title: "Weekly intelligence brief", description: "A preview of future source review, evidence synthesis and founder briefing settings.", checked: weekly, setChecked: setWeekly, icon: CalendarClock }, { title: "Monthly source health audit", description: "A preview of future link, duplicate and relevance review settings.", checked: monthly, setChecked: setMonthly, icon: RefreshCw }].map((item) => <section key={item.title} className="signal-panel p-5 sm:p-6"><div className="flex items-start gap-3"><span className="grid size-9 place-items-center rounded-md bg-brand-soft text-brand"><item.icon className="size-4" /></span><div className="min-w-0 flex-1"><h2 className="text-sm font-semibold">{item.title}</h2><p className="mt-1.5 text-[11px] leading-5 text-muted-foreground">{item.description}</p></div><Switch checked={item.checked} onCheckedChange={(checked) => { item.setChecked(checked); toast.message(checked ? "Schedule preview enabled locally." : "Schedule preview turned off.", { description: "No task has been scheduled or run." }); }} aria-label={`Toggle ${item.title}`} /></div><div className="mt-5 space-y-4 border-t border-border pt-4">{[{ label: "Frequency", value: item.title.startsWith("Weekly") ? "Every Monday" : "First week of the month" }, { label: "Preferred time", value: "09:00 · local time" }, { label: "Timezone", value: "Asia/Kolkata" }, { label: "Next run", value: "Not scheduled" }].map((row) => <div key={row.label} className="flex flex-wrap items-center justify-between gap-2 text-[11px]"><span className="text-muted-foreground">{row.label}</span><span className="font-medium">{row.value}</span></div>)}</div><div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[10px] text-muted-foreground"><span>Execution history</span><span>No runs recorded</span></div></section>)}</div><section className="signal-panel mt-4 p-5"><PanelHeading title="Manual run" detail="Running a job requires a connected service." action={<Button type="button" variant="outline" size="sm" onClick={() => toast.message("Run unavailable", { description: "This frontend preview does not perform source checks or create briefings." })} className="h-8 gap-1.5 text-[11px]"><Zap className="size-3.5" />Run now</Button>} /><p className="max-w-2xl text-[11px] leading-5 text-muted-foreground">Scheduling switches change their visible state only. Nothing is persisted, queued, emailed or executed.</p></section></>;
}

function OperationsPage() {
  const panels = [{ name: "API availability", value: "—", detail: "No service connected", icon: Globe2, tone: "brand" as const }, { name: "Source checks", value: "—", detail: "Not configured", icon: Radio, tone: "cyan" as const }, { name: "Crawl success", value: "—", detail: "No crawl has run", icon: Activity, tone: "success" as const }, { name: "Pending jobs", value: "—", detail: "No queue connected", icon: Zap, tone: "warning" as const }, { name: "Model usage", value: "—", detail: "No AI service connected", icon: Bot, tone: "brand" as const }, { name: "Processing time", value: "—", detail: "No jobs processed", icon: Clock3, tone: "cyan" as const }];
  return <><PageHeading page="operations" action={<PreviewNotice />} /><DemoLabel /><div className="mb-4 rounded-md border border-warning/25 bg-warning-soft/55 p-3.5 text-[11px] leading-5 text-warning"><span className="font-semibold">Demonstration layout only.</span> These panels do not display measured service health, AI usage, token consumption, job queues, errors or latency.</div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{panels.map((metric) => <MetricCard key={metric.name} label={metric.name} value={metric.value} description={metric.detail} icon={metric.icon} tone={metric.tone} />)}</div><div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(270px,0.75fr)]"><section className="signal-panel p-5"><PanelHeading title="Service signals" detail="Illustrative layout · no observations recorded" />{[{ label: "Research services", icon: Search }, { label: "Source monitoring", icon: Radio }, { label: "Scheduled runs", icon: CalendarClock }, { label: "Brief generation", icon: BookOpen }].map((service) => <div key={service.label} className="flex items-center gap-3 border-b border-border/70 py-3 last:border-0"><span className="grid size-8 place-items-center rounded bg-secondary text-muted-foreground"><service.icon className="size-4" /></span><span className="flex-1 text-xs font-medium">{service.label}</span><span className="text-[10px] text-muted-foreground">Not connected</span><span className="size-1.5 rounded-full bg-muted-foreground/40" /></div>)}</section><section className="signal-panel p-5"><PanelHeading title="Recent events" detail="No operational history" /><div className="flex min-h-[145px] flex-col items-center justify-center text-center"><Activity className="size-5 text-muted-foreground" /><div className="mt-2.5 text-xs font-semibold">No events to display</div><div className="mt-1 max-w-[220px] text-[10px] leading-5 text-muted-foreground">Failed jobs, trends and processing events will appear when a service is connected.</div></div></section></div></>;
}

function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({ brief: true, alerts: true, updates: false });
  const prefs = [{ id: "brief", label: "Briefing reminders", detail: "Local preference preview for future brief notifications." }, { id: "alerts", label: "Important source changes", detail: "Local preference preview for source change notices." }, { id: "updates", label: "Product updates", detail: "Local preference preview for workspace news." }];
  return <><PageHeading page="settings" action={<PreviewNotice />} /><DemoLabel /><div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(290px,0.75fr)]"><div className="space-y-4"><section className="signal-panel p-5 sm:p-6"><PanelHeading title="Your preferences" detail="Preview only · this page does not save settings." />{prefs.map((preference) => <div key={preference.id} className="flex items-center gap-3 border-b border-border/70 py-4 last:border-0"><div className="min-w-0 flex-1"><div className="text-xs font-semibold">{preference.label}</div><p className="mt-1 text-[10px] leading-4 text-muted-foreground">{preference.detail}</p></div><Switch checked={toggles[preference.id]} onCheckedChange={(checked) => { setToggles((current) => ({ ...current, [preference.id]: checked })); toast.message("Preference changed in this preview only."); }} aria-label={preference.label} /></div>)}</section><section className="signal-panel p-5 sm:p-6"><PanelHeading title="Company preferences" detail="Company context used to shape intelligence." /><label className="block text-xs font-medium">Company focus<textarea defaultValue="Focus areas can be added after a company conversation and review." className="mt-2 min-h-20 w-full rounded-md border border-input bg-background p-3 text-xs leading-5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" /></label><Button type="button" variant="outline" size="sm" onClick={() => toast.message("Company preferences were not saved.")} className="mt-3 h-8 text-[11px]">Save preview</Button></section></div><div className="space-y-4"><section className="signal-panel p-5 sm:p-6"><PanelHeading title="Monitoring preferences" detail="Example cadence · no schedules active." />{[{ label: "Briefing time", value: "Monday · 09:00" }, { label: "Time zone", value: "Asia/Kolkata" }, { label: "Monitoring cadence", value: "Not configured" }, { label: "Source refresh", value: "Not configured" }, { label: "Monthly audit", value: "Not scheduled" }].map((entry) => <div key={entry.label} className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 py-3 last:border-0"><span className="text-[11px] text-muted-foreground">{entry.label}</span><span className="text-[11px] font-medium">{entry.value}</span></div>)}</section><section className="signal-panel p-5 sm:p-6"><PanelHeading title="Data and security" /><div className="flex gap-2.5"><LockKeyhole className="size-4 shrink-0 text-success" /><p className="text-[11px] leading-5 text-muted-foreground">This preview does not collect account credentials or send your entries to an external service. Refreshing the page clears temporary changes.</p></div><Button type="button" variant="ghost" size="sm" onClick={() => toast.message("No demo data was saved to clear.")} className="mt-3 h-8 gap-1.5 px-1 text-[10px] text-muted-foreground"><Upload className="size-3.5" />Data controls</Button></section></div></div></>;
}

function Footer() {
  return <footer className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border/70 px-5 py-4 text-[9px] text-muted-foreground lg:px-8"><span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-warning" />Illustrative preview · not connected to live data</span><span>Signal Stack · Frontend workspace</span></footer>;
}

export function AppShell({ page }: { page: Section }) {
  const [company, setCompany] = useState<CompanyName>("MeetUniversity");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [search, setSearch] = useState("");
  const [sources, setSources] = useState<PreviewSource[]>(previewSources);
  const navigate = useNavigate();
  useEffect(() => {
    const stored = window.localStorage.getItem("signal-stack-theme");
    if (stored === "dark") setIsDark(true);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem("signal-stack-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const onNavigate = (section: Section) => { void navigate({ to: "/workspace/$section", params: { section } }); };
  const action = page === "overview" ? <CompanyPicker company={company} onChange={setCompany} /> : null;

  return (
    <div className="signal-frame flex min-h-screen w-full">
      <Sidebar page={page} company={company} collapsed={collapsed} onCollapse={() => setCollapsed((value) => !value)} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar company={company} setCompany={setCompany} collapsed={collapsed} onMobileMenu={() => setMobileOpen(true)} isDark={isDark} onToggleTheme={() => setIsDark((value) => !value)} search={search} setSearch={setSearch} />
        <div className="flex flex-wrap items-center gap-2 border-b border-border/60 bg-warning-soft/35 px-4 py-2.5 md:px-6"><PreviewNotice />{action}<span className="ml-auto hidden text-[10px] text-muted-foreground sm:inline">Example data only · no live processing</span></div>
        <main id="main-content" className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 md:px-6 md:py-8 xl:px-8">
          <div key={page} className="signal-enter">
            {page === "overview" && <OverviewPage company={company} onNavigate={onNavigate} />}
            {page === "setup" && <SetupPage company={company} />}
            {page === "research" && <ResearchPage company={company} />}
            {page === "interview" && <InterviewPage company={company} />}
            {page === "profile" && <ProfilePage company={company} />}
            {page === "signals" && <SignalStackPage />}
            {page === "sources" && <SourcesPage sources={sources} setSources={setSources} />}
            {page === "feed" && <FeedPage />}
            {page === "brief" && <BriefPage company={company} />}
            {page === "automation" && <AutomationPage />}
            {page === "operations" && <OperationsPage />}
            {page === "settings" && <SettingsPage />}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}