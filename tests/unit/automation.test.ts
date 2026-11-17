import { describe, it, expect } from "vitest";
import { DistributedLockManager } from "../../apps/api/src/automation/lock.js";
import { TimezoneScheduler } from "../../apps/api/src/automation/timezone.js";
import { WeeklyBriefAutomation } from "../../apps/api/src/automation/weekly-brief-automation.js";
import { MonthlySignalStackAudit } from "../../apps/api/src/automation/monthly-audit-automation.js";

describe("Signal Stack Automation & Background Systems", () => {
  it("Distributed Lock: Prevents overlapping concurrent job execution", async () => {
    const lock = new DistributedLockManager();
    const lockKey = "lock:company_123";

    const acquired1 = await lock.acquireLock(lockKey, "worker_1", 2);
    expect(acquired1).toBe(true);

    // Second worker attempts to acquire same lock
    const acquired2 = await lock.acquireLock(lockKey, "worker_2", 2);
    expect(acquired2).toBe(false);

    // Worker 1 releases lock
    const released = await lock.releaseLock(lockKey, "worker_1");
    expect(released).toBe(true);

    // Worker 2 can now acquire lock
    const acquiredAfter = await lock.acquireLock(lockKey, "worker_2", 2);
    expect(acquiredAfter).toBe(true);
  });

  it("Timezone Scheduler: Canonical UTC evaluation with simulated clock", () => {
    // Simulated Monday at 07:00 UTC
    const mondayMorningUtc = new Date(Date.UTC(2026, 1, 16, 7, 0, 0)); // Feb 16, 2026 is Monday

    const isDueMonday = TimezoneScheduler.isJobDue({
      cronExpression: "0 6 * * 1",
      timezone: "Asia/Kolkata",
      currentTimeUtc: mondayMorningUtc,
    });
    expect(isDueMonday).toBe(true);

    // Simulated Sunday at 07:00 UTC -> should NOT be due
    const sundayUtc = new Date(Date.UTC(2026, 1, 15, 7, 0, 0));
    const isDueSunday = TimezoneScheduler.isJobDue({
      cronExpression: "0 6 * * 1",
      timezone: "Asia/Kolkata",
      currentTimeUtc: sundayUtc,
    });
    expect(isDueSunday).toBe(false);
  });

  it("Automation A: Weekly Intelligence Brief runs and exposes brief ID", async () => {
    const weeklyAutomation = new WeeklyBriefAutomation();
    const res = await weeklyAutomation.runWeeklyCycle({
      companyId: "c0000000-0000-0000-0000-000000000001",
      isManual: true, // Manual 'Run Now'
    });

    expect(res.success).toBe(true);
    expect(res.record.status).toBe("completed");
    expect(res.record.briefId).toBeDefined();
    expect(res.record.processedSources).toBeGreaterThan(0);
    expect(res.record.generatedSignals).toBeGreaterThan(0);
  });

  it("Automation B: Monthly Signal Stack Audit identifies dead URLs and recommendations", async () => {
    const monthlyAudit = new MonthlySignalStackAudit();
    const report = await monthlyAudit.runMonthlyAudit("c0000000-0000-0000-0000-000000000001");

    expect(report.auditId).toBeDefined();
    expect(report.totalAudited).toBe(2);
    expect(report.deadUrlsCount).toBe(1);
    expect(report.recommendations.removals).toContain("src_02");
    expect(report.recommendations.additions.length).toBeGreaterThan(0);
  });
});
