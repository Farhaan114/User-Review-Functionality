// middleware/checkAdmin.js
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET; // Use your secret key here

function checkAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, secretKey);
    if (decoded.role === 'admin') {
      req.user = decoded; // Attach decoded user information to request
      next();
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ message: 'Access denied' });
  }
}

module.exports = checkAdmin;
