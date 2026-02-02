const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');
const { verifyToken } = require('../middleware/auth');

// Create or get user profile
router.post('/profile', verifyToken, async (req, res) => {
    try {
        const { email, fullName, barCouncilNumber, photoURL } = req.body;
        const firebaseUid = req.user.uid;

        console.log('Upserting user profile for UID:', firebaseUid);

        const { data, error } = await supabase
            .from('users')
            .upsert({
                firebase_uid: firebaseUid,
                email: email || '',
                full_name: fullName || 'Counsel',
                bar_council_number: barCouncilNumber || '',
                photo_url: photoURL || null,
                updated_at: new Date().toISOString()
            }, { onConflict: 'firebase_uid' })
            .select()
            .single();

        if (error) {
            console.error('Supabase Upsert Error:', error);
            return res.status(500).json({
                error: 'Database error during profile sync',
                message: error.message,
                details: error
            });
        }
        res.json(data);
    } catch (error) {
        console.error('Crash in /api/users/profile POST:', error);
        res.status(500).json({ error: 'Server crash during profile sync', message: error.message });
    }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        console.log('Fetching user profile for UID:', firebaseUid);

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('firebase_uid', firebaseUid)
            .single();

        if (error) {
            console.warn('Supabase Fetch Error (expected if new user):', error.message);
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: 'User profile not found' });
            }
            return res.status(500).json({ error: 'Database error fetching profile', message: error.message });
        }
        res.json(data);
    } catch (error) {
        console.error('Crash in /api/users/profile GET:', error);
        res.status(500).json({ error: 'Server crash fetching profile', message: error.message });
    }
});

module.exports = router;
