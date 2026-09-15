import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) throw new Error("Supabase environment variables are missing.");

export const supabase = createBrowserClient(url, key, {
  auth: { flowType: "pkce", autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
});
