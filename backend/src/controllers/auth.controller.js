const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const blacklistedTokens = new Set(); // 👈 Store revoked tokens here

exports.getBlacklist = () => blacklistedTokens; // 👈 Export getter for middleware
const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

exports.register = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    // check existing
    const existing = await User.findOne({ where: { email: value.email } });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(value.password, 10);
    const user = await User.create({ name: value.name, email: value.email, password_hash: hash });

    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const user = await User.findOne({ where: { email: value.email }});
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(value.password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(400).json({ message: 'Token missing' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(400).json({ message: 'Invalid token format' });

    // Add token to blacklist
    blacklistedTokens.add(token);

    res.status(200).json({ message: 'Logged out successfully.' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error during logout' });
  }
};
