import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kyebanwdwcpufohvstxd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5ZWJhbndkd2NwdWZvaHZzdHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODE1NTcsImV4cCI6MjA5NDM1NzU1N30.J9nTR1OynTd6WU1yWPunqzy9j7oNKR4S0idwLwn2ffU';

export const isSupabaseConfigured = true;

// Provide fallback values to avoid crashing before the user configures their environment variables.
// The store.ts functions check for VITE_SUPABASE_URL before executing any queries.
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

