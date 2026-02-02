const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');
const { verifyToken } = require('../middleware/auth');

// Get all cases
router.get('/', verifyToken, async (req, res) => {
    try {
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('firebase_uid', req.user.uid)
            .single();

        if (userError || !user) return res.json([]);

        const { data, error } = await supabase
            .from('cases')
            .select(`
        *,
        clients (name)
      `)
            .eq('created_by', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Format response
        const formattedCases = data.map(c => ({
            ...c,
            client_name: c.clients?.name
        }));

        res.json(formattedCases);
    } catch (error) {
        console.error('Error fetching cases:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get single case
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('cases')
            .select(`
        *,
        clients (name),
        hearings (*),
        documents (*)
      `)
            .eq('id', req.params.id)
            .single();

        if (error) throw error;

        // Format response
        const formattedCase = {
            ...data,
            client_name: data.clients?.name,
            timeline: [
                { date: data.created_at, type: 'Filing', description: 'Case filed', user: 'System' }
            ]
        };

        res.json(formattedCase);
    } catch (error) {
        console.error('Error fetching case:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create case
router.post('/', verifyToken, async (req, res) => {
    try {
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('firebase_uid', req.user.uid)
            .single();

        if (userError || !user) return res.status(404).json({ error: 'User profile not found' });

        const { data, error } = await supabase
            .from('cases')
            .insert({
                ...req.body,
                created_by: user.id
            })
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error creating case:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update case
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('cases')
            .update({
                ...req.body,
                updated_at: new Date()
            })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error updating case:', error);
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id', verifyToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('cases')
            .update({
                ...req.body,
                updated_at: new Date()
            })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error updating case:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete case
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { error } = await supabase
            .from('cases')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Case deleted successfully' });
    } catch (error) {
        console.error('Error deleting case:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
