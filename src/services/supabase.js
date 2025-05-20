import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ovefaeunajgfuejhjmdh.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92ZWZhZXVuYWpnZnVlamhqbWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MDczMDUsImV4cCI6MjA2MzE4MzMwNX0.mu0J5IchR2be4lU1beFpqUYtGiJv8CufwxbBRRdLhAc";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;