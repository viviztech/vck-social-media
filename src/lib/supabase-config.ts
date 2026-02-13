// Supabase client configuration
// Replace these with your actual Supabase project credentials
export const supabaseConfig = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key',
};
