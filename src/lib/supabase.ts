import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (import.meta.env["VITE_SUPABASE_URL"] as string | undefined) || "https://ssmlgxdpddcuvoqbzcdj.supabase.co";
const supabaseAnonKey =
  (import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined) || "sb_publishable_Eq2QL4P6r6b1k-1Xm9JQ9g_AKRGox_l";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
