
  import { createClient } from '@supabase/supabase-js';
  
  const supabaseUrl = 'https://axfxzasuzgzfnkwsnpyz.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4Znh6YXN1emd6Zm5rd3NucHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyMzAwODIsImV4cCI6MjA0NzgwNjA4Mn0.tWBFktshc9KWzGamYkc53xopv6TrP5LI6p7EQC4dyKc';
  
  export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true, // Ensure the session persists
      detectSessionInUrl: true, // Allow session detection in redirects
      autoRefreshToken: true, // Enable token auto-refresh
    },
  });
  