const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');
const { verifyToken } = require('../middleware/auth');

// Get all notifications for the current user
router.get('/', verifyToken, async (req, res) => {
    try {
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('firebase_uid', req.user.uid)
            .single();

        if (userError || !user) {
            console.warn(`Notifications: User profile not found for UID: ${req.user.uid}. Returning empty list.`);
            return res.json([]);
        }

        const { data: notifications, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase Notification Error:', error);
            return res.json([]); // Return empty rather than 500
        }
        res.json(notifications || []);
    } catch (error) {
        console.error('Crash in /api/notifications GET:', error);
        res.json([]);
    }
});

// Mark a single notification as read
router.patch('/:id/read', verifyToken, async (req, res) => {
    try {
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('firebase_uid', req.user.uid)
            .single();

        if (userError || !user) return res.status(404).json({ error: 'User not found' });

        const { data, error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', req.params.id)
            .eq('user_id', user.id)
            .select();

        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ error: error.message });
    }
});

// Mark all notifications as read
router.patch('/read-all', verifyToken, async (req, res) => {
    try {
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('firebase_uid', req.user.uid)
            .single();

        if (userError || !user) return res.status(404).json({ error: 'User not found' });

        const { data, error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false)
            .select();

        if (error) throw error;
        res.json({ message: `Marked ${data.length} notifications as read` });
    } catch (error) {
        console.error('Error marking all as read:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
