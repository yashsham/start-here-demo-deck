import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  Search,
  MessageSquareText,
  Layers3,
  Network,
  Globe2,
  Radio,
  BookOpen,
  Zap,
  Activity,
  Settings2,
  ChevronLeft,
  ChevronRight,
  X,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { navGroups, type Section, type CompanyInfo } from "../data";

const iconMap: Record<string, LucideIcon> = {
  layout: LayoutDashboard,
  building: Building2,
  search: Search,
  messages: MessageSquareText,
  layers: Layers3,
  stack: Network,
  sources: Globe2,
  feed: Radio,
  brief: BookOpen,
  automation: Zap,
  operations: Activity,
  settings: Settings2,
};

export function AppSidebar({
  currentSection,
  currentCompany,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: {
  currentSection: Section;
  currentCompany: CompanyInfo;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-xs lg:hidden cursor-pointer"
        />
      )}

      <aside
        className={`signal-sidebar fixed inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border transition-all duration-200 lg:relative lg:z-auto lg:translate-x-0 ${
          collapsed ? "w-[76px]" : "w-[264px]"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand Header */}
        <div
          className={`flex h-[64px] shrink-0 items-center border-b border-sidebar-border ${
            collapsed ? "justify-center px-3" : "justify-between px-5"
          }`}
        >
          <Link
            to="/"
            onClick={onCloseMobile}
            className="flex items-center gap-3 text-sidebar-foreground group"
            aria-label="Signal Stack Home"
          >
            <span className="grid size-8 shrink-0 grid-cols-2 gap-[3px] rounded-lg border border-sidebar-border bg-sidebar-hover p-[6px] shadow-xs group-hover:border-primary/50 transition-colors">
              <span className="rounded-[2px] bg-primary" />
              <span className="rounded-[2px] bg-primary/70" />
              <span className="rounded-[2px] bg-cyan" />
              <span className="rounded-[2px] bg-primary/40" />
            </span>

            {!collapsed && (
              <div className="min-w-0">
                <span className="signal-brand block truncate text-sm font-bold tracking-tight text-sidebar-foreground">
                  signal stack
                </span>
                <span className="block text-[9px] font-semibold uppercase tracking-wider text-sidebar-muted">
                  Executive Intelligence
                </span>
              </div>
            )}
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCloseMobile}
            className="size-8 text-sidebar-muted hover:text-sidebar-foreground lg:hidden"
            aria-label="Close navigation menu"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Active Company Capsule */}
        <div className={`py-3.5 ${collapsed ? "px-2.5" : "px-4"}`}>
          {!collapsed && (
            <div className="mb-2 px-1 text-[9px] font-bold uppercase tracking-wider text-sidebar-muted">
              Target Company
            </div>
          )}
          <div
            className={`flex items-center rounded-lg border border-sidebar-border bg-sidebar-hover/50 p-2 ${
              collapsed ? "justify-center" : "gap-3"
            }`}
          >
            <span className="grid size-8 shrink-0 place-items-center rounded bg-primary/15 text-[11px] font-bold text-primary">
              {currentCompany.monogram}
            </span>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <span className="block truncate text-xs font-bold text-sidebar-foreground">
                  {currentCompany.name}
                </span>
                <span className="block truncate text-[10px] text-sidebar-muted">
                  {currentCompany.domain}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Groups */}
        <nav
          aria-label="Sidebar navigation"
          className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 pb-4"
        >
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <div className="mb-2 px-2 text-[9px] font-bold uppercase tracking-wider text-sidebar-muted">
                  {group.label}
                </div>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = iconMap[item.icon] || LayoutDashboard;
                  const isActive = currentSection === item.id;

                  return (
                    <Link
                      key={item.id}
                      to="/workspace/$section"
                      params={{ section: item.id }}
                      onClick={onCloseMobile}
                      data-active={isActive}
                      className={`signal-sidebar-link flex min-h-9 items-center gap-3 rounded-md px-3 text-xs font-medium transition-all ${
                        collapsed ? "justify-center px-0" : ""
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="size-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {item.id === "brief" && !collapsed && (
                        <span className="ml-auto size-1.5 rounded-full bg-warning" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Footnote */}
        <div className={`shrink-0 border-t border-sidebar-border p-3 ${collapsed ? "text-center" : ""}`}>
          <div
            className={`flex items-center gap-2.5 rounded-md bg-sidebar-hover/60 p-2 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="grid size-7 shrink-0 place-items-center rounded-full bg-cyan/20 text-[10px] font-bold text-cyan">
              AK
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-sidebar-foreground">
                  Alex Kim
                </span>
                <span className="block truncate text-[10px] text-sidebar-muted">
                  Enterprise Operator
                </span>
              </div>
            )}
            {!collapsed && <MoreHorizontal className="size-4 text-sidebar-muted" />}
          </div>
        </div>

        {/* Sidebar Collapse Toggle Button */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onToggleCollapse}
          className="absolute -right-3 top-16 hidden size-6 rounded-full border border-border bg-card shadow-sm text-muted-foreground hover:text-foreground lg:flex items-center justify-center"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="size-3" /> : <ChevronLeft className="size-3" />}
        </Button>
      </aside>
    </>
  );
}
