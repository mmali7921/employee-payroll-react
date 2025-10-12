const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user still exists and is active
    const userResult = await executeQuery(
      'SELECT id, username, email, role, is_active FROM users WHERE id = ? AND is_active = TRUE',
      [decoded.userId]
    );

    if (!userResult.success || userResult.data.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }

    req.user = userResult.data[0];
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

// Check if user has admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  next();
};

// Check if user has HR or admin role
const requireHR = (req, res, next) => {
  if (!['admin', 'hr'].includes(req.user.role)) {
    return res.status(403).json({ 
      success: false, 
      message: 'HR or Admin access required' 
    });
  }
  next();
};

// Log user actions
const logAction = async (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Log the action after response is sent
    if (req.user && req.method !== 'GET') {
      const logData = {
        action: `${req.method} ${req.originalUrl}`,
        details: {
          user_id: req.user.id,
          user_name: req.user.username,
          ip_address: req.ip,
          user_agent: req.get('User-Agent'),
          timestamp: new Date().toISOString()
        }
      };

      // Don't await this to avoid blocking the response
      executeQuery(
        'INSERT INTO audit_logs (action, details, user_name, ip_address) VALUES (?, ?, ?, ?)',
        [logData.action, JSON.stringify(logData.details), req.user.username, req.ip]
      ).catch(err => console.error('Failed to log action:', err));
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireHR,
  logAction
};
