import fs from 'fs';
import path from 'path';

// Ensure logs directory exists
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

export const requestLogger = (req, res, next) => {
    res.on('finish', () => {
        // Extract timestamp
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        
        // Extract userId if present (from auth header, req.user, or req.body), default to 'GUEST'
        const userId = req.userId || req.body?.userId || req.user?.id || 'GUEST';
        
        // Target URL
        const url = req.originalUrl || req.url;

        // Custom format: Timestamp - UserID - URL
        const logLine = `${timestamp} - ${userId} - ${url}\n`;

        // Append to logs/app.log file
        fs.appendFile(path.join(logDir, 'app.log'), logLine, (err) => {
            if (err) console.error('Error writing to log file:', err);
        });
    });

    next();
};