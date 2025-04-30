const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const loggerMiddleware = async (req, res, next) => {
  const start = Date.now();
  
  // Store the original end function
  const originalEnd = res.end;
  
  // Override the end function
  res.end = async function(chunk, encoding) {
    const responseTime = Date.now() - start;
    const { method, originalUrl, body, user } = req;
    const statusCode = res.statusCode;
    
    try {
      await pool.execute(
        'INSERT INTO api_logs (user_id, method, path, request_body, status_code, response_time, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [
          user?.id || null,
          method,
          originalUrl,
          JSON.stringify(body),
          statusCode,
          responseTime
        ]
      );
    } catch (error) {
      console.error('Error logging API call:', error);
    }
    
    // Call the original end function
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

module.exports = loggerMiddleware; 