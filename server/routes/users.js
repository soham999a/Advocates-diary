const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');
const { verifyToken } = require('../middleware/auth');

// Create or get user profile
router.post('/profile', verifyToken, async (req, res) => {
    try {
        const { email, fullName, barCouncilNumber, photoURL } = req.body;
        const firebaseUid = req.user.uid;

        const { data, error } = await supabase
            .from('users')
            .upsert({
                firebase_uid: firebaseUid,
                email,
                full_name: fullName,
                bar_council_number: barCouncilNumber,
                photo_url: photoURL || null,
                updated_at: new Date()
            }, { onConflict: 'firebase_uid' })
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error creating user profile:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const firebaseUid = req.user.uid;

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('firebase_uid', firebaseUid)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
