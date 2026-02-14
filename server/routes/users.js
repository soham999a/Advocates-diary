const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');
const { verifyToken } = require('../middleware/auth');

// Create or get user profile
router.post('/profile', verifyToken, async (req, res) => {
    try {
        const { email, fullName, barCouncilNumber, photoURL } = req.body;
        const firebaseUid = req.user.uid;

        console.log('🔄 Syncing user profile for UID:', firebaseUid);

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
            .select();

        if (error) {
            console.error('❌ Supabase Upsert Error:', error);
            return res.status(500).json({
                error: 'Database error',
                message: error.message,
                details: error
            });
        }

        console.log('✅ Profile synced successfully');
        res.json(data ? data[0] : null);
    } catch (error) {
        console.error('💥 Crash in /api/users/profile POST:', error);
        res.status(500).json({ error: 'Server crash during profile sync', message: error.message });
    }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        console.log('🔍 Fetching user profile for UID:', firebaseUid);

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('firebase_uid', firebaseUid)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                console.warn('⚠️ Profile not found for UID:', firebaseUid);
                return res.status(404).json({ error: 'User profile not found' });
            }
            console.error('❌ Supabase Fetch Error:', error.message);
            return res.status(500).json({ error: 'Database error fetching profile', message: error.message });
        }
        res.json(data);
    } catch (error) {
        console.error('💥 Crash in /api/users/profile GET:', error);
        res.status(500).json({ error: 'Server crash fetching profile', message: error.message });
    }
});

module.exports = router;
