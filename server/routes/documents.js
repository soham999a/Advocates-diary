const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');
const { verifyToken } = require('../middleware/auth');

// Get documents by case
router.get('/', verifyToken, async (req, res) => {
    try {
        const { case_id } = req.query;

        let query = supabase
            .from('documents')
            .select('*')
            .order('uploaded_at', { ascending: false });

        if (case_id) {
            query = query.eq('case_id', case_id);
        }

        const { data, error } = await query;

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: error.message });
    }
});

// Upload document
router.post('/', verifyToken, async (req, res) => {
    try {
        const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('firebase_uid', req.user.uid)
            .single();

        const { data, error } = await supabase
            .from('documents')
            .insert({
                ...req.body,
                uploaded_by: user.id
            })
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error uploading document:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete document
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { error } = await supabase
            .from('documents')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
