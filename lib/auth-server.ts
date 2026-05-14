import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { cache } from 'react';

/**
 * Server-side cached user fetch.
 * Reads the Supabase auth token from cookies and validates it.
 * Cached per-request via React cache() — no duplicate API calls.
 */
export const getServerUser = cache(async () => {
  try {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    if (!supabaseUrl || !supabaseAnonKey) return null;

    // Extract project ref from URL to find the auth cookie
    const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
    const authCookieName = `sb-${projectRef}-auth-token`;

    const authCookie = cookieStore.get(authCookieName);
    if (!authCookie) return null;

    // Supabase stores session as JSON array: [access_token, refresh_token, ...]
    const parsed = JSON.parse(authCookie.value);
    const accessToken = parsed?.[0];
    if (!accessToken) return null;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: parsed[1] || '',
    });

    const { data: { user } } = await supabase.auth.getUser();
    return user ?? null;
  } catch {
    return null;
  }
});