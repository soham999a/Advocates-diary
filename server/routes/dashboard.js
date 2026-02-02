const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');
const { verifyToken } = require('../middleware/auth');

// Get dashboard stats
router.get('/stats', verifyToken, async (req, res) => {
    try {
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('firebase_uid', req.user.uid)
            .single();

        if (userError || !user) {
            console.warn(`User profile not found for UID: ${req.user.uid}. Returning default stats.`);
            return res.json({
                totalCases: 0,
                upcomingHearings: 0,
                overdueTasks: 0,
                activeClients: 0
            });
        }

        // Get total cases
        const { count: totalCases } = await supabase
            .from('cases')
            .select('*', { count: 'exact', head: true })
            .eq('created_by', user.id);

        // Get upcoming hearings (next 30 days)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const { count: upcomingHearings } = await supabase
            .from('hearings')
            .select('*', { count: 'exact', head: true })
            .eq('created_by', user.id)
            .gte('hearing_date', new Date().toISOString())
            .lte('hearing_date', thirtyDaysFromNow.toISOString());

        // Get overdue tasks
        const { count: overdueTasks } = await supabase
            .from('tasks')
            .select('*', { count: 'exact', head: true })
            .eq('created_by', user.id)
            .eq('status', 'Pending')
            .lt('due_date', new Date().toISOString());

        // Get active clients
        const { count: activeClients } = await supabase
            .from('clients')
            .select('*', { count: 'exact', head: true })
            .eq('created_by', user.id);

        res.json({
            totalCases: totalCases || 0,
            upcomingHearings: upcomingHearings || 0,
            overdueTasks: overdueTasks || 0,
            activeClients: activeClients || 0
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get recent activity
router.get('/activity', verifyToken, async (req, res) => {
    try {
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('firebase_uid', req.user.uid)
            .single();

        if (userError || !user) {
            console.warn(`User profile not found for UID: ${req.user.uid}. Returning empty activity.`);
            return res.json([]);
        }

        // Fetch recent cases
        const { data: cases } = await supabase
            .from('cases')
            .select('case_number, case_title, created_at')
            .eq('created_by', user.id)
            .order('created_at', { ascending: false })
            .limit(5);

        // Fetch recent hearings
        const { data: hearings } = await supabase
            .from('hearings')
            .select('case_id, hearing_date, hearing_type, cases(case_number)')
            .eq('created_by', user.id)
            .order('created_at', { ascending: false })
            .limit(5);

        // Fetch recent documents
        const { data: documents } = await supabase
            .from('documents')
            .select('filename, uploaded_at, cases(case_number)')
            .eq('uploaded_by', user.id)
            .order('uploaded_at', { ascending: false })
            .limit(5);

        // Merge and format activity
        const activities = [
            ...(cases || []).map(c => ({
                id: `case-${c.case_number}`,
                type: 'case',
                title: `New case ${c.case_number} created`,
                description: c.case_title,
                timestamp: c.created_at,
                iconColor: 'bg-blue-500'
            })),
            ...(hearings || []).map(h => ({
                id: `hearing-${h.case_id}-${h.hearing_date}`,
                type: 'hearing',
                title: `Hearing scheduled for ${h.cases?.case_number || 'Case'}`,
                description: `${h.hearing_type} on ${new Date(h.hearing_date).toLocaleDateString('en-IN')}`,
                timestamp: h.hearing_date,
                iconColor: 'bg-green-500'
            })),
            ...(documents || []).map(d => ({
                id: `doc-${d.filename}`,
                type: 'document',
                title: `Document uploaded`,
                description: `${d.filename} for ${d.cases?.case_number || 'Case'}`,
                timestamp: d.uploaded_at,
                iconColor: 'bg-purple-500'
            }))
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);

        res.json(activities);
    } catch (error) {
        console.error('Error fetching activity:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
