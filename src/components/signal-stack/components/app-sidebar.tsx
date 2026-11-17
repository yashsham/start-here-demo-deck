import { useState, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
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
  LogOut,
  LogIn,
  Upload,
  UserCircle2,
  Check,
  Camera,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
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
  const { user, profile, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [editName, setEditName] = useState(profile?.fullName || "");
  const [editOrg, setEditOrg] = useState(profile?.organizationName || "");
  const [editAvatar, setEditAvatar] = useState(profile?.avatarUrl || "");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = profile?.fullName
    ? profile.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : profile?.email
    ? profile.email.slice(0, 2).toUpperCase()
    : "OP";

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image file too large", { description: "Please upload an image smaller than 2MB." });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setEditAvatar(result);
        toast.success("Image selected", { description: "Click Save to apply your new profile photo." });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateProfile({
        fullName: editName.trim() || profile?.fullName,
        organizationName: editOrg.trim() || profile?.organizationName,
        avatarUrl: editAvatar !== undefined ? editAvatar : profile?.avatarUrl,
      });
      if (res.success) {
        toast.success("Profile updated successfully", {
          description: "Your profile information and photo have been updated.",
        });
        setProfileDialogOpen(false);
      } else {
        toast.error("Profile update failed", { description: res.error });
      }
    } catch (err: any) {
      toast.error("Error", { description: err?.message || "Failed to save profile." });
    } finally {
      setIsSaving(false);
    }
  };

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

        {/* User Profile Footer */}
        <div className={`shrink-0 border-t border-sidebar-border p-3 ${collapsed ? "text-center" : ""}`}>
          {profile ? (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={`flex w-full items-center gap-2.5 rounded-md bg-sidebar-hover/60 p-2 text-left hover:bg-sidebar-hover transition-colors cursor-pointer group ${
                    collapsed ? "justify-center" : ""
                  }`}
                  aria-label="User profile settings"
                >
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName || "User Avatar"}
                      className="size-7 shrink-0 rounded-full object-cover ring-1 ring-border"
                    />
                  ) : (
                    <div className="grid size-7 shrink-0 place-items-center rounded-full bg-cyan/20 text-[10px] font-bold text-cyan">
                      {initials}
                    </div>
                  )}
                  {!collapsed && (
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold text-sidebar-foreground group-hover:text-primary transition-colors">
                        {profile.fullName || "Operator"}
                      </span>
                      <span className="block truncate text-[10px] text-sidebar-muted">
                        {profile.organizationName || "Signal Stack"}
                      </span>
                    </div>
                  )}
                  {!collapsed && (
                    <MoreHorizontal className="size-4 text-sidebar-muted group-hover:text-sidebar-foreground" />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent side="right" align="end" className="w-[280px] p-4 shadow-2xl space-y-3 z-50">
                <div className="flex items-center gap-3">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName || "Avatar"}
                      className="size-10 rounded-full object-cover ring-2 ring-primary/30"
                    />
                  ) : (
                    <div className="grid size-10 place-items-center rounded-full bg-cyan/20 text-sm font-bold text-cyan ring-1 ring-border">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="block font-bold text-xs text-foreground truncate">
                      {profile.fullName || "Operator"}
                    </span>
                    <span className="block text-[11px] text-muted-foreground truncate">
                      {profile.email}
                    </span>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className={`text-[9px] px-1.5 py-0 ${
                          profile.isDemo
                            ? "bg-warning-soft text-warning border-warning/30"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        }`}
                      >
                        {profile.isDemo ? "Sandbox Demo" : "Supabase Auth"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {profile.organizationName && (
                  <div className="rounded-md bg-secondary/50 p-2 text-[11px] text-muted-foreground">
                    <span className="font-semibold text-foreground">Organization: </span>
                    {profile.organizationName}
                  </div>
                )}

                <div className="space-y-1.5 pt-2 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditName(profile.fullName || "");
                      setEditOrg(profile.organizationName || "");
                      setEditAvatar(profile.avatarUrl || "");
                      setProfileDialogOpen(true);
                    }}
                    className="w-full justify-start text-xs h-8 gap-2 cursor-pointer"
                  >
                    <Camera className="size-3.5 text-brand" />
                    <span>Edit Profile & Avatar</span>
                  </Button>

                  <button
                    type="button"
                    onClick={() => void navigate({ to: "/signup" })}
                    className="w-full text-left px-2 py-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    Switch Account / Re-login
                  </button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      await signOut();
                      void navigate({ to: "/signup" });
                    }}
                    className="w-full justify-start text-xs h-8 text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 gap-2 cursor-pointer"
                  >
                    <LogOut className="size-3.5" />
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
              className={`w-full gap-2 text-xs border-brand/40 bg-brand/10 hover:bg-brand/20 text-brand cursor-pointer ${
                collapsed ? "px-0 justify-center" : ""
              }`}
            >
              <LogIn className="size-3.5" />
              {!collapsed && <span>Sign In / Up</span>}
            </Button>
          )}
        </div>

        {/* Edit Profile & Photo Dialog */}
        <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
          <DialogContent className="max-w-[480px]">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <UserCircle2 className="size-5 text-brand" />
                <span>Edit Profile & Photo</span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Update your account details and upload a custom profile avatar image.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveProfile} className="space-y-4 py-2">
              {/* Avatar Preview & Upload */}
              <div className="flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-3">
                {editAvatar ? (
                  <img
                    src={editAvatar}
                    alt="Avatar Preview"
                    className="size-14 rounded-full object-cover ring-2 ring-brand"
                  />
                ) : (
                  <div className="grid size-14 place-items-center rounded-full bg-cyan/20 text-lg font-bold text-cyan ring-1 ring-border">
                    {initials}
                  </div>
                )}
                <div className="space-y-1.5 flex-1">
                  <span className="block text-xs font-semibold text-foreground">Profile Avatar</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileChange}
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-7 text-xs gap-1.5 cursor-pointer"
                    >
                      <Upload className="size-3" />
                      <span>Upload Image</span>
                    </Button>
                    {editAvatar && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditAvatar("")}
                        className="h-7 text-xs text-muted-foreground hover:text-rose-400"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <span className="block text-[10px] text-muted-foreground">
                    PNG, JPG, or WebP up to 2MB.
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Full Name</label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  placeholder="Your full name"
                  className="text-xs text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900/60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Company / Organization</label>
                <Input
                  value={editOrg}
                  onChange={(e) => setEditOrg(e.target.value)}
                  placeholder="Your organization name"
                  className="text-xs text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900/60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Or Avatar Image URL (Optional)
                </label>
                <Input
                  value={editAvatar.startsWith("data:") ? "" : editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="text-xs font-mono text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900/60"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setProfileDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isSaving} className="gap-1.5">
                  {isSaving ? "Saving..." : "Save Profile"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

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
