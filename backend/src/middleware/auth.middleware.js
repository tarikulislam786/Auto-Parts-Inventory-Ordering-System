const jwt = require('jsonwebtoken');

const { getBlacklist } = require('../controllers/auth.controller'); // 👈 Import blacklist getter
const blacklistedTokens = getBlacklist();

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: 'Access denied. No token provided.' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token format.' });

  // Check blacklist
  if (blacklistedTokens.has(token)) {
    return res.status(401).json({ message: 'Token is removed. Please log in again.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
