const SUPABASE_URL = "https://avvwtenmextqyxgejujj.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2dnd0ZW5tZXh0cXl4Z2VqdWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1Mzc1MzMsImV4cCI6MjA3MTExMzUzM30.PT3I_pSoCit_d8n7L5cqNZg8Vujxx5RmFsX9v6it7ok";

window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  global: {
    fetch: fetch, 
  },
});
