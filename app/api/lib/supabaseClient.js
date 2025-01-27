import { createClient } from '@supabase/supabase-js';

// postgresql://postgres.aycpixytkleukacruxyo:DwAd7eeQKHOSKvLc@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
const supabaseUrl = 'https://aycpixytkleukacruxyo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5Y3BpeHl0a2xldWthY3J1eHlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5NjA4MzYsImV4cCI6MjA1MzUzNjgzNn0.Qmh0ZIMQ5Px7UduSr7fGNei6rJoBGmAMdWarb7iR9As';

export const supabase = createClient(supabaseUrl, supabaseKey);
