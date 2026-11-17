# Signal Stack — Database Backup and Disaster Recovery

1. **Continuous WAL Archiving**:
   - Supabase Point-in-Time Recovery (PITR) enabled with up to 30 days retention.

2. **Logical Backups**:
   - Scheduled pg_dump execution daily via Supabase CLI / GitHub Action.
   - Encrypted at rest using AES-256 and stored in multi-region cold object storage.

3. **Recovery Procedures**:
   - **RPO (Recovery Point Objective)**: < 5 minutes via write-ahead log replay.
   - **RTO (Recovery Time Objective)**: < 30 minutes to restore a multi-gigabyte instance.
