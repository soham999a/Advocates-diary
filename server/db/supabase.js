const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://MISSING_SUPABASE_URL.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'MISSING_SUPABASE_KEY';

let supabase;
try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
        console.error('❌ CRITICAL: Supabase credentials missing.');
        // Create a mock/noop client if missing to prevent startup crash
        supabase = {
            from: () => ({
                select: () => ({
                    eq: () => ({
                        single: () => Promise.resolve({ data: null, error: { message: 'Supabase URL missing' } }),
                        order: () => ({ limit: () => Promise.resolve({ data: [], error: { message: 'Supabase URL missing' } }) })
                    })
                })
            })
        };
    } else {
        supabase = createClient(supabaseUrl, supabaseKey);
    }
} catch (error) {
    console.error('❌ Supabase Init Error:', error);
    supabase = {}; // Fallback
}

module.exports = supabase;
