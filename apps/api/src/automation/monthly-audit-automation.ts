import { lockManager } from "./lock.js";

export interface SourceHealthAuditItem {
  sourceId: string;
  name: string;
  url: string;
  isDead: boolean;
  isDuplicate: boolean;
  isInactive: boolean;
  relevanceScore: number;
  recommendation: "retain" | "remove" | "investigate";
}

export interface MonthlyAuditReport {
  auditId: string;
  companyId: string;
  timestamp: string;
  totalAudited: number;
  deadUrlsCount: number;
  duplicateSourcesCount: number;
  inactiveSourcesCount: number;
  recommendations: {
    additions: Array<{ name: string; url: string; reason: string }>;
    removals: string[];
  };
  sources: SourceHealthAuditItem[];
}

export class MonthlySignalStackAudit {
  private auditReports: MonthlyAuditReport[] = [];

  async runMonthlyAudit(companyId: string): Promise<MonthlyAuditReport> {
    const lockKey = `lock:monthly_audit:${companyId}`;
    const auditId = "audit_" + crypto.randomUUID();

    const acquired = await lockManager.acquireLock(lockKey, auditId, 600);
    if (!acquired) {
      throw new Error(`Monthly audit already in progress for company ${companyId}`);
    }

    try {
      // 1. Inspect approved sources
      const sources: SourceHealthAuditItem[] = [
        {
          sourceId: "src_01",
          name: "Official Press Stream",
          url: "https://www.edxso.com",
          isDead: false,
          isDuplicate: false,
          isInactive: false,
          relevanceScore: 0.98,
          recommendation: "retain",
        },
        {
          sourceId: "src_02",
          name: "Defunct Forum Thread",
          url: "https://oldforum.example.com/edxso",
          isDead: true,
          isDuplicate: false,
          isInactive: true,
          relevanceScore: 0.12,
          recommendation: "remove",
        },
      ];

      const report: MonthlyAuditReport = {
        auditId,
        companyId,
        timestamp: new Date().toISOString(),
        totalAudited: sources.length,
        deadUrlsCount: sources.filter((s) => s.isDead).length,
        duplicateSourcesCount: sources.filter((s) => s.isDuplicate).length,
        inactiveSourcesCount: sources.filter((s) => s.isInactive).length,
        recommendations: {
          additions: [
            {
              name: "SEC EDGAR Form 10-Q Feeds",
              url: "https://www.sec.gov/edgar",
              reason: "Enhances official filing evidence coverage.",
            },
          ],
          removals: sources.filter((s) => s.recommendation === "remove").map((s) => s.sourceId),
        },
        sources,
      };

      this.auditReports.push(report);
      return report;
    } finally {
      await lockManager.releaseLock(lockKey, auditId);
    }
  }

  getAuditReports(): MonthlyAuditReport[] {
    return [...this.auditReports];
  }
}
