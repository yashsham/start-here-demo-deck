import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Command,
  ArrowRight,
  ShieldCheck,
  Zap,
  LogOut,
  User as UserIcon,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { CompanySwitcher } from "./company-switcher";
import { navGroups, type CompanyName } from "../data";

export function AppHeader({
  currentCompany,
  onCompanyChange,
  onOpenMobile,
  isDark,
  onToggleTheme,
}: {
  currentCompany: CompanyName;
  onCompanyChange: (name: CompanyName) => void;
  onOpenMobile: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}) {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const initials = useMemo(() => {
    if (!profile?.fullName) return "SS";
    return profile.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [profile]);

  // All navigable items for Cmd+K search
  const allRoutes = useMemo(
    () =>
      navGroups.flatMap(
        (g) => g.items as readonly { id: string; label: string; icon: string }[]
      ),
    []
  );

  const matchedRoutes = useMemo(() => {
    if (!search.trim()) return [];
    const query = search.toLowerCase();
    return allRoutes.filter((item) => item.label.toLowerCase().includes(query));
  }, [search, allRoutes]);

  // Global Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectRoute = (id: string) => {
    void navigate({ to: "/workspace/$section", params: { section: id } });
    setSearch("");
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-[64px] items-center justify-between border-b border-border/80 bg-background/95 px-4 backdrop-blur-md md:px-6">
      {/* Left: Mobile trigger & Company Switcher */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onOpenMobile}
          className="size-8 text-muted-foreground lg:hidden"
          aria-label="Open navigation drawer"
        >
          <Menu className="size-4" />
        </Button>

        <CompanySwitcher
          currentCompany={currentCompany}
          onCompanyChange={onCompanyChange}
        />

        <div className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-semibold text-muted-foreground sm:flex">
          <span className="size-1.5 rounded-full bg-success animate-pulse" />
          <span>Operational</span>
        </div>
      </div>

      {/* Right: Search, Notifications, Theme, Profile */}
      <div className="flex items-center gap-2">
        {/* Global Search */}
        <div className="relative hidden sm:block w-[220px] md:w-[260px]">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsSearchOpen(true);
            }}
            placeholder="Search workspace (Cmd+K)"
            className="h-9 rounded-lg border-border bg-card pl-8 pr-12 text-xs placeholder:text-muted-foreground"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5 rounded border border-border bg-secondary px-1 text-[9px] font-mono text-muted-foreground">
            <Command className="size-2.5" />K
          </kbd>

          {isSearchOpen && search.trim() && (
            <div className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-lg border border-border bg-popover shadow-xl">
              <div className="border-b border-border px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Matching Workspace Screens
              </div>
              <div className="max-h-[260px] overflow-y-auto p-1">
                {matchedRoutes.length > 0 ? (
                  matchedRoutes.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectRoute(item.id)}
                      className="flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-left text-xs text-foreground hover:bg-accent"
                    >
                      <span className="font-medium">{item.label}</span>
                      <ArrowRight className="size-3 text-muted-foreground" />
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                    No matching pages found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative size-8 text-muted-foreground hover:text-foreground"
              aria-label="View notifications"
            >
              <Bell className="size-4" />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-warning ring-2 ring-background" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[320px] p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <span className="text-xs font-bold text-foreground">Workspace Notifications</span>
              <span className="rounded bg-brand-soft px-1.5 py-0.5 text-[9px] font-bold text-brand">
                1 New
              </span>
            </div>
            <div className="mt-3 space-y-2.5">
              <div className="rounded-lg border border-border/80 bg-secondary/30 p-2.5 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <Zap className="size-3 text-brand" />
                  CBSE 2027 Directive Flagged
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                  Experiential learning mandate extracted from Central Board gazette. Added to Monday Brief candidate list.
                </p>
                <span className="mt-1.5 block text-[9px] text-muted-foreground">Today at 04:30 AM</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Theme Switcher */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggleTheme}
          className="size-8 text-muted-foreground hover:text-foreground"
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        >
          {isDark ? <Sun className="size-4 text-warning" /> : <Moon className="size-4" />}
        </Button>

        {/* User Profile / Auth State */}
        {profile ? (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-[10px] font-bold text-brand ring-1 ring-border cursor-pointer hover:ring-brand/50 transition-all overflow-hidden"
                aria-label="User profile menu"
              >
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName || "User"}
                    className="size-full object-cover"
                  />
                ) : (
                  initials
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[260px] p-4 shadow-xl space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    {profile.avatarUrl && (
                      <img
                        src={profile.avatarUrl}
                        alt="Avatar"
                        className="size-6 rounded-full object-cover shrink-0 ring-1 ring-border"
                      />
                    )}
                    <span className="font-bold text-xs text-foreground truncate">{profile.fullName}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[9px] ${
                      profile.isDemo
                        ? "bg-warning-soft text-warning border-warning/30"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    {profile.isDemo ? "Demo Sandbox" : "Supabase Auth"}
                  </Badge>
                </div>
                <span className="block text-[11px] text-muted-foreground truncate">{profile.email}</span>
                {profile.organizationName && (
                  <span className="block text-[10px] text-muted-foreground/80 mt-0.5">
                    {profile.organizationName}
                  </span>
                )}
              </div>
              <div className="pt-2 border-t border-border flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => void navigate({ to: "/signup" })}
                  className="text-[11px] text-brand hover:underline cursor-pointer"
                >
                  Switch Account
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await signOut();
                    void navigate({ to: "/signup" });
                  }}
                  className="h-7 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 px-2 gap-1.5 cursor-pointer"
                >
                  <LogOut className="size-3" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void navigate({ to: "/signup" })}
            className="h-8 gap-1.5 text-xs border-brand/40 bg-brand/10 hover:bg-brand/20 text-brand cursor-pointer"
          >
            <LogIn className="size-3.5" />
            <span>Sign In / Up</span>
          </Button>
        )}
      </div>
    </header>
  );
}
