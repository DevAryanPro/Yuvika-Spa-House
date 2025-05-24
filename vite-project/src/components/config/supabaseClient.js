import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oznubufxhelabkpqfglu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96bnVidWZ4aGVsYWJrcHFmZ2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMjAwNTksImV4cCI6MjA2MzU5NjA1OX0.K44q4hxkDFco1DBdH6mOGaNREG_mMinCHSRfRscTMIY';

export const supabase = createClient(supabaseUrl, supabaseKey);
