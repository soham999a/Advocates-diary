const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');
const { verifyToken } = require('../middleware/auth');

// Get all hearings
router.get('/', verifyToken, async (req, res) => {
    try {
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('firebase_uid', req.user.uid)
            .single();

        if (userError || !user) return res.json([]);

        const { data, error } = await supabase
            .from('hearings')
            .select(`
        *,
        cases (case_number, case_title)
      `)
            .eq('created_by', user.id)
            .order('hearing_date', { ascending: true });

        if (error) throw error;

        const formattedHearings = data.map(h => ({
            ...h,
            case_number: h.cases?.case_number
        }));

        res.json(formattedHearings);
    } catch (error) {
        console.error('Error fetching hearings:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get today's hearings
router.get('/today', verifyToken, async (req, res) => {
    try {
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('firebase_uid', req.user.uid)
            .single();

        if (userError || !user) return res.json([]);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const { data, error } = await supabase
            .from('hearings')
            .select(`
        *,
        cases (case_number)
      `)
            .eq('created_by', user.id)
            .gte('hearing_date', today.toISOString())
            .lt('hearing_date', tomorrow.toISOString())
            .order('hearing_date', { ascending: true });

        if (error) throw error;

        const formattedHearings = data.map(h => ({
            ...h,
            case_number: h.cases?.case_number
        }));

        res.json(formattedHearings);
    } catch (error) {
        console.error('Error fetching today\'s hearings:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create hearing
router.post('/', verifyToken, async (req, res) => {
    try {
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('firebase_uid', req.user.uid)
            .single();

        if (userError || !user) return res.status(404).json({ error: 'User profile not found' });

        const { data, error } = await supabase
            .from('hearings')
            .insert({
                ...req.body,
                created_by: user.id
            })
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error creating hearing:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update hearing
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('hearings')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error updating hearing:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete hearing
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { error } = await supabase
            .from('hearings')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Hearing deleted successfully' });
    } catch (error) {
        console.error('Error deleting hearing:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
