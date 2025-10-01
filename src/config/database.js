const { createClient } = require('@supabase/supabase-js');
const config = require('./index');

// Create Supabase client with anon key (for auth operations)
const supabaseClient = createClient(config.supabase.url, config.supabase.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false
  }
});

// Create Supabase admin client with service key (for admin operations)
const supabaseAdmin = createClient(config.supabase.url, config.supabase.serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

module.exports = {
  supabaseClient,
  supabaseAdmin
};