export interface LockRecord {
  lockKey: string;
  ownerId: string;
  acquiredAt: number;
  expiresAt: number;
}

export class DistributedLockManager {
  private locks = new Map<string, LockRecord>();

  async acquireLock(lockKey: string, ownerId: string, ttlSeconds = 300): Promise<boolean> {
    const now = Date.now();
    const existing = this.locks.get(lockKey);

    if (existing && existing.expiresAt > now) {
      // Lock is still actively held
      return false;
    }

    // Acquire or take over expired lock
    this.locks.set(lockKey, {
      lockKey,
      ownerId,
      acquiredAt: now,
      expiresAt: now + ttlSeconds * 1000,
    });
    return true;
  }

  async releaseLock(lockKey: string, ownerId: string): Promise<boolean> {
    const existing = this.locks.get(lockKey);
    if (!existing) return true;
    if (existing.ownerId === ownerId) {
      this.locks.delete(lockKey);
      return true;
    }
    return false;
  }

  isLocked(lockKey: string): boolean {
    const existing = this.locks.get(lockKey);
    return Boolean(existing && existing.expiresAt > Date.now());
  }
}

export const lockManager = new DistributedLockManager();
