import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export function isSupabaseConfigured() {
  return (
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl !== "your-supabase-url" &&
    supabaseKey !== "your-supabase-anon-key" &&
    supabaseUrl.startsWith("https://")
  );
}

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}
