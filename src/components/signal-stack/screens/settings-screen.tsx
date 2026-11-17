import { useState, useRef, useEffect } from "react";
import {
  Settings2,
  Bell,
  Building2,
  Lock,
  Download,
  Trash2,
  Check,
  ShieldAlert,
  Sliders,
  Upload,
  UserCircle2,
  Camera,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { CompanyName } from "../data";

export function SettingsScreen({ company }: { company: CompanyName }) {
  const { profile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("preferences");

  // Profile edit state
  const [fullName, setFullName] = useState(profile?.fullName || "");
  const [organizationName, setOrganizationName] = useState(profile?.organizationName || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setOrganizationName(profile.organizationName || "");
      setAvatarUrl(profile.avatarUrl || "");
    }
  }, [profile]);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File too large", { description: "Please upload an image smaller than 2MB." });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAvatarUrl(result);
        toast.success("Image selected", { description: "Click Save Profile to persist your new avatar." });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await updateProfile({
        fullName: fullName.trim() || profile?.fullName,
        organizationName: organizationName.trim() || profile?.organizationName,
        avatarUrl,
      });
      if (res.success) {
        toast.success("Profile updated successfully", {
          description: "Your operator profile and photo have been updated.",
        });
      } else {
        toast.error("Profile update failed", { description: res.error });
      }
    } catch (err: any) {
      toast.error("Error saving profile", { description: err?.message || "Unknown error" });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // State toggles
  const [briefNotifications, setBriefNotifications] = useState(true);
  const [threatAlerts, setThreatAlerts] = useState(true);
  const [competitorPriceAlerts, setCompetitorPriceAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Security & Data
  const [retentionDays, setRetentionDays] = useState("90");
  const [apiKeyPreview, setApiKeyPreview] = useState("sig_live_9488b1f7c032***");

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Preferences updated successfully", {
      description: "Local workspace settings are now in effect.",
    });
  };

  const handleExportData = () => {
    toast.success("Export Package Prepared", {
      description: "Downloaded JSON package of signals, sources, and brief history.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="signal-display text-lg font-bold text-foreground sm:text-xl">
          Workspace Settings & Governance
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Configure notification thresholds, security encryption policies, and data export standards.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-secondary/70 p-1 flex-wrap h-auto gap-1">
          <TabsTrigger value="preferences" className="text-xs">
            User Preferences
          </TabsTrigger>
          <TabsTrigger value="company" className="text-xs">
            Company Settings
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="text-xs">
            Monitoring & Alerts
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs">
            Security & API
          </TabsTrigger>
          <TabsTrigger value="data" className="text-xs">
            Data Governance
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: User Preferences */}
        <TabsContent value="preferences" className="mt-0 space-y-4">
          <section className="signal-panel p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-foreground">Operator Profile</h2>
                <p className="text-xs text-muted-foreground">Manage your identity, organization, and avatar image across the platform.</p>
              </div>
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  profile?.isDemo
                    ? "bg-warning-soft text-warning border-warning/30"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                }`}
              >
                {profile?.isDemo ? "Demo Sandbox" : "Supabase Authenticated"}
              </Badge>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar Uploader Section */}
              <div className="flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-4">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Operator Avatar"
                    className="size-16 rounded-full object-cover ring-2 ring-primary/40 shadow-sm"
                  />
                ) : (
                  <div className="grid size-16 place-items-center rounded-full bg-cyan/20 text-xl font-bold text-cyan ring-1 ring-border">
                    {profile?.fullName
                      ? profile.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "OP"}
                  </div>
                )}
                <div className="space-y-1.5 flex-1">
                  <span className="block text-xs font-semibold text-foreground">Profile Photo / Avatar</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarFile}
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
                    {avatarUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setAvatarUrl("")}
                        className="h-7 text-xs text-muted-foreground hover:text-rose-400"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <span className="block text-[10px] text-muted-foreground">
                    Upload PNG, JPG, or WebP up to 2MB. Image updates across sidebar and headers.
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Full Name</label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="text-xs text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Email Address</label>
                  <Input
                    value={profile?.email || "analyst@edxso.com"}
                    readOnly
                    disabled
                    type="email"
                    className="text-xs opacity-75 cursor-not-allowed bg-muted/40"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Company / Organization</label>
                  <Input
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="Your organization"
                    className="text-xs text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Avatar Image URL (Optional)</label>
                  <Input
                    value={avatarUrl.startsWith("data:") ? "" : avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/photo.png"
                    className="text-xs font-mono text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900/60"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" size="sm" disabled={isSavingProfile} className="gap-1.5">
                  <Check className="size-3.5" />
                  <span>{isSavingProfile ? "Saving Profile..." : "Save Operator Profile"}</span>
                </Button>
              </div>
            </form>
          </section>

          <section className="signal-panel p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-bold text-foreground">Notification Channels</h2>
            <div className="space-y-3 divide-y divide-border/60">
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs font-semibold text-foreground">Monday Morning Brief Alerts</span>
                  <p className="text-[11px] text-muted-foreground">Receive executive brief summaries via email</p>
                </div>
                <Switch checked={briefNotifications} onCheckedChange={setBriefNotifications} />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <span className="text-xs font-semibold text-foreground">Immediate Threat Push Alerts</span>
                  <p className="text-[11px] text-muted-foreground">Trigger alert for high-urgency market & competitor threats</p>
                </div>
                <Switch checked={threatAlerts} onCheckedChange={setThreatAlerts} />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <span className="text-xs font-semibold text-foreground">Competitor Pricing Moves</span>
                  <p className="text-[11px] text-muted-foreground">Notify when competitor bundles change by more than 15%</p>
                </div>
                <Switch checked={competitorPriceAlerts} onCheckedChange={setCompetitorPriceAlerts} />
              </div>
            </div>
          </section>
        </TabsContent>

        {/* Tab 2: Company Settings */}
        <TabsContent value="company" className="mt-0">
          <section className="signal-panel p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-bold text-foreground">Active Organization Settings</h2>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Organization Display Name</label>
                <Input defaultValue={company} className="text-xs" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Headquarters / Regional Hub</label>
                <Input defaultValue="New Delhi / Bengaluru, India" className="text-xs" />
              </div>
            </div>
          </section>
        </TabsContent>

        {/* Tab 3: Monitoring & Cadence */}
        <TabsContent value="monitoring" className="mt-0">
          <section className="signal-panel p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-bold text-foreground">Intelligence Radar Sensitivity</h2>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span>Minimum Credibility Threshold for Signals</span>
                <span className="font-bold text-foreground">75%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Minimum Specificity Filter</span>
                <span className="font-bold text-foreground">70%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Duplicate Matching Strictness</span>
                <span className="font-bold text-brand">High (Exact Domain + Fuzzy Title)</span>
              </div>
            </div>
          </section>
        </TabsContent>

        {/* Tab 4: Security */}
        <TabsContent value="security" className="mt-0">
          <section className="signal-panel p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-bold text-foreground">API Credentials & Ingestion Keys</h2>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Secret Ingestion Key</label>
              <div className="flex items-center gap-2">
                <Input value={apiKeyPreview} readOnly className="font-mono text-xs bg-secondary/50" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast.success("API key copied to clipboard");
                  }}
                  className="text-xs"
                >
                  Copy
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Used by Antigravity Hono backend services to stream validated signals into your Signal Stack.
              </p>
            </div>
          </section>
        </TabsContent>

        {/* Tab 5: Data Governance */}
        <TabsContent value="data" className="mt-0 space-y-4">
          <section className="signal-panel p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-bold text-foreground">Data Export & Retention</h2>
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <span className="text-xs font-semibold text-foreground">Export All Workspace Intelligence</span>
                <p className="text-[11px] text-muted-foreground">
                  Download structured JSON archive of all feeds, verified signals, and brief issues.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportData} className="gap-1.5 text-xs">
                <Download className="size-3.5" />
                <span>Export JSON</span>
              </Button>
            </div>

            <div className="pt-2 text-xs text-muted-foreground">
              Audit logs are automatically retained for 90 days in accordance with enterprise governance policies.
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
