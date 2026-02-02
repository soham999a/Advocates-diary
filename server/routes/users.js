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
                email,
                full_name: fullName,
                bar_council_number: barCouncilNumber || '',
                photo_url: photoURL || null,
                updated_at: new Date().toISOString()
            }, { onConflict: 'firebase_uid' })
            .select()
            .single();

        if (error) {
            console.error('Supabase Upsert Error:', error);
            throw error;
        }
        res.json(data);
    } catch (error) {
        console.error('Error in /api/users/profile POST:', error);
        res.status(500).json({ error: error.message, details: error });
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
            console.error('Supabase Fetch Error:', error);
            // If user not found, don't return 500, return 404 or empty
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: 'User profile not found' });
            }
            throw error;
        }
        res.json(data);
    } catch (error) {
        console.error('Error in /api/users/profile GET:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
