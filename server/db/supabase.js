const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://MISSING_SUPABASE_URL.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'MISSING_SUPABASE_KEY';

let supabase;
try {
    const isMissing = !process.env.SUPABASE_URL ||
        !process.env.SUPABASE_ANON_KEY ||
        (typeof process.env.SUPABASE_URL === 'string' && process.env.SUPABASE_URL.includes('MISSING'));

    if (isMissing) {
        console.error('❌ CRITICAL: Supabase credentials missing or malformed.');

        // Use a Proxy to catch all nested method calls and prevent crashes
        const createMock = () => {
            const mock = {
                from: () => createMock(),
                select: () => createMock(),
                upsert: () => createMock(),
                insert: () => createMock(),
                update: () => createMock(),
                delete: () => createMock(),
                eq: () => createMock(),
                neq: () => createMock(),
                gt: () => createMock(),
                lt: () => createMock(),
                gte: () => createMock(),
                lte: () => createMock(),
                order: () => createMock(),
                limit: () => createMock(),
                single: () => Promise.resolve({ data: null, error: { message: 'Database Configuration Missing (Check Vercel Env Vars)', code: 'CONFIG_MISSING' } }),
                then: (cb) => Promise.resolve({ data: null, error: { message: 'Database Configuration Missing', code: 'CONFIG_MISSING' } }).then(cb),
                catch: (cb) => Promise.resolve({ data: null, error: { message: 'Database Configuration Missing', code: 'CONFIG_MISSING' } }).catch(cb)
            };
            return mock;
        };
        supabase = createMock();
    } else {
        console.log('🔌 Initializing Supabase client for URL:', supabaseUrl.substring(0, 15) + '...');
        supabase = createClient(supabaseUrl, supabaseKey, {
            auth: {
                persistSession: false
            }
        });
    }
} catch (error) {
    console.error('❌ Supabase Init Error:', error);
    supabase = {};
}

module.exports = supabase;
