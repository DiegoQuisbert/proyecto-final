import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://crrrlgpxhutxisjwsrxd.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycnJsZ3B4aHV0eGlzandzcnhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTcxOTQsImV4cCI6MjA3ODQ3MzE5NH0.JTaDuSQcOxmVGANTs8FaMRGV6ds8gKCpkuRlj1TQhcg";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;