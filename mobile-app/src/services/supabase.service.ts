import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://uifqzdahexyokikkzsgf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpZnF6ZGFoZXh5b2tpa2t6c2dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNzgzNTAsImV4cCI6MjA3Nzk1NDM1MH0.joaOZoKyGXJ3i3c8vl13nrYPJbVty5tZ4M9ORZbR58Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

