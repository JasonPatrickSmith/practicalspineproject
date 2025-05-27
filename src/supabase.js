import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ciwgecvuyjtifxdvkafb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpd2dlY3Z1eWp0aWZ4ZHZrYWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNzgzNTQsImV4cCI6MjA2Mzg1NDM1NH0.oHeWW4KrcmQhkqpS1P84HfdyUD0fkhOiDp95BiYcLLg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)