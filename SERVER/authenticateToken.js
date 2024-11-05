// middleware/authenticateToken.js
const jwt = require('jsonwebtoken');
const secretKey = 'dff6643a6c96477a465ecd45c83255d84820720bc603afe9766d3c7566996776d6ffed7f4eac89634a130814f8cfbcf758196954518de8fbd2b8c250e9d3214c'; // Use the same secret key used to sign the token

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user; // Attach the user info (decoded from the token) to req.user
    next();
  });
}

module.exports = authenticateToken;
