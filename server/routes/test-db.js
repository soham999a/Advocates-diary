const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');

router.get('/check', async (req, res) => {
    try {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_ANON_KEY;

        const results = {
            env: {
                hasUrl: !!url,
                hasKey: !!key,
                urlPrefix: url ? url.substring(0, 15) + '...' : 'none'
            },
            connectivity: 'stating...'
        };

        const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });

        if (error) {
            results.connectivity = 'failed';
            results.error = error;
        } else {
            results.connectivity = 'success';
            results.dataSize = data;
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

module.exports = router;
