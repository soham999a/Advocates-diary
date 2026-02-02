const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Advocate Diary API is running' });
});

// Import routes
const usersRoutes = require('./routes/users');
const casesRoutes = require('./routes/cases');
const clientsRoutes = require('./routes/clients');
const hearingsRoutes = require('./routes/hearings');
const documentsRoutes = require('./routes/documents');
const dashboardRoutes = require('./routes/dashboard');
const notificationsRoutes = require('./routes/notifications');
const testDbRoutes = require('./routes/test-db');

// Use routes
app.use('/api/users', usersRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/hearings', hearingsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/test-db', testDbRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('🔥 Server Error:', err);
    res.status(500).json({
        error: 'Backend Crash',
        message: err.message,
        path: req.path,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Export for Vercel
module.exports = app;

// Start server if run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    });
}
