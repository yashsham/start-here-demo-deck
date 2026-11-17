import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { CompanyName } from "../data";

export function SettingsScreen({ company }: { company: CompanyName }) {
  const [activeTab, setActiveTab] = useState("preferences");

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
            <h2 className="text-sm font-bold text-foreground">Operator Profile</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Full Name</label>
                <Input defaultValue="Alex Kim" className="text-xs" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Email Address</label>
                <Input defaultValue="alex.kim@edxso.internal" type="email" className="text-xs" />
              </div>
            </div>
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
