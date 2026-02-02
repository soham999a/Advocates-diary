const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://MISSING_SUPABASE_URL.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'MISSING_SUPABASE_KEY';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('❌ CRITICAL ERROR: Supabase credentials missing from environment.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
