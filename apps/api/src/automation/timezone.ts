export class TimezoneScheduler {
  /**
   * Evaluates if a company's weekly schedule is due at target simulated time.
   * Canonical schedules are expressed in UTC with target company timezone offset.
   */
  public static isJobDue(params: {
    cronExpression: string; // e.g. "0 6 * * 1" (Monday at 06:00 UTC)
    timezone: string; // e.g. "Asia/Kolkata", "America/New_York", "UTC"
    lastRunAt?: string | null;
    currentTimeUtc?: Date;
  }): boolean {
    const now = params.currentTimeUtc || new Date();

    if (params.lastRunAt) {
      const lastRun = new Date(params.lastRunAt);
      const elapsedHours = (now.getTime() - lastRun.getTime()) / (1000 * 60 * 60);
      // Prevent running again within 20 hours of same cycle
      if (elapsedHours < 20) {
        return false;
      }
    }

    // Parse simple weekday and hour from cron
    const parts = params.cronExpression.split(" ");
    if (parts.length >= 5) {
      const targetHour = parseInt(parts[1], 10);
      const targetDay = parseInt(parts[4], 10); // 1 = Monday

      const currentUtcDay = now.getUTCDay();
      const currentUtcHour = now.getUTCHours();

      if (!isNaN(targetDay) && targetDay !== currentUtcDay) return false;
      if (!isNaN(targetHour) && currentUtcHour < targetHour) return false;
    }

    return true;
  }
}
