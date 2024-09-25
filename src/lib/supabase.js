import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zvqcsgqhjbbqaolxwkvj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2cWNzZ3FoamJicWFvbHh3a3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcyMDc3MzMsImV4cCI6MjA0Mjc4MzczM30.pATpzCg9OJWSzFOTANzGrB35N-Af4XKQgaOSDNv_2rI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);