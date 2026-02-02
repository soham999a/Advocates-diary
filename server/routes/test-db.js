const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');

router.get('/check', async (req, res) => {
    try {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_ANON_KEY;

        const results = {
            env: {
                SUPABASE_URL_SET: !!url,
                SUPABASE_ANON_KEY_SET: !!key,
                URL_HINT: url ? url.substring(0, 20) + '...' : 'MISSING',
                NODE_ENV: process.env.NODE_ENV || 'not set'
            },
            connectivity: 'Initiating test...',
            timestamp: new Date().toISOString()
        };

        const { data, error, status, statusText } = await supabase
            .from('users')
            .select('id', { count: 'exact', head: true })
            .limit(1);

        if (error) {
            results.connectivity = 'FAILED ❌';
            results.error = {
                code: error.code,
                message: error.message,
                hint: error.hint,
                details: error.details,
                httpStatus: status,
                httpStatusText: statusText
            };
        } else {
            results.connectivity = 'SUCCESS ✅';
            results.databaseResponse = 'Authenticated & Connected';
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

module.exports = router;
