import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ekfumusrqyknppmguoyk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrZnVtdXNycXlrbnBwbWd1b3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwOTY2NTAsImV4cCI6MjA3NzY3MjY1MH0.80xZFj50BX4WDIdmNQDwe__FzgWI5osJK3gtyC5u2uE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


