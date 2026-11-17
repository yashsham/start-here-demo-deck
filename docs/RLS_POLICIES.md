# Signal Stack — Row Level Security (RLS) Policy Architecture

All 36 tenant-owned tables enforce PostgreSQL Row Level Security (RLS):

1. **Authentication Context Resolution**:
   - `auth_org_id()` reads `request.jwt.claim.organization_id` from the decoded JWT.
   - `auth_is_service_role()` verifies if the caller is the internal service worker.

2. **Policy Enforcement Matrix**:
   - `SELECT`: `organization_id = auth_org_id() OR auth_is_service_role()`
   - `INSERT`: `WITH CHECK (organization_id = auth_org_id() OR auth_is_service_role())`
   - `UPDATE`: `USING (organization_id = auth_org_id() OR auth_is_service_role()) WITH CHECK (organization_id = auth_org_id() OR auth_is_service_role())`
   - `DELETE`: `USING (organization_id = auth_org_id() OR auth_is_service_role())`

3. **Key Safeguards**:
   - Cross-organization queries return 0 rows.
   - Frontend client uses Supabase anon/publishable key; service role key is strictly confined to Cloudflare Worker backend.
