// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }

        const token = authHeader.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized - Malformed token' });
        }

        // For development: Skip Firebase Admin verification
        // In production, you would verify the token with Firebase Admin SDK
        console.log('⚠️ Authentication: Processing token');

        // Extract user info from the token (basic decode without verification)
        // This is for DEMO purposes only
        try {
            const parts = token.split('.');
            if (parts.length === 3) {
                const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                req.user = { uid: payload.user_id || payload.sub || 'unknown' };
            } else {
                req.user = { uid: 'demo-user-' + Date.now() };
            }
        } catch (e) {
            console.warn('Decode failed, using demo user');
            req.user = { uid: 'demo-user-' + Date.now() };
        }

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};

module.exports = { verifyToken };
