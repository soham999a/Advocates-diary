const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');
const { verifyToken } = require('../middleware/auth');

// Get all clients
router.get('/', verifyToken, async (req, res) => {
    try {
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('firebase_uid', req.user.uid)
            .single();

        if (userError || !user) return res.json([]);

        const { data, error } = await supabase
            .from('clients')
            .select(`
        *,
        cases (id),
        invoices (amount, status)
      `)
            .eq('created_by', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Calculate stats for each client
        const formattedClients = data.map(client => ({
            ...client,
            cases_count: client.cases?.length || 0,
            outstanding_fees: client.invoices
                ?.filter(inv => inv.status === 'Pending')
                .reduce((sum, inv) => sum + parseFloat(inv.amount), 0) || 0
        }));

        res.json(formattedClients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get single client
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('clients')
            .select(`
        *,
        cases (id, case_number, status),
        invoices (*)
      `)
            .eq('id', req.params.id)
            .single();

        if (error) throw error;

        // Calculate outstanding fees
        const outstanding_fees = data.invoices
            ?.filter(inv => inv.status === 'Pending')
            .reduce((sum, inv) => sum + parseFloat(inv.amount), 0) || 0;

        res.json({
            ...data,
            outstanding_fees
        });
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create client
router.post('/', verifyToken, async (req, res) => {
    try {
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('firebase_uid', req.user.uid)
            .single();

        if (userError || !user) return res.status(404).json({ error: 'User profile not found' });

        const { data, error } = await supabase
            .from('clients')
            .insert({
                ...req.body,
                created_by: user.id
            })
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update client
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('clients')
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
        console.error('Error updating client:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
