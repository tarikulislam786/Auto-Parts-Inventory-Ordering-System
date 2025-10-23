const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const partsRoutes = require('./routes/parts.routes');
const errorMiddleware = require('./middleware/error.middleware');
require('dotenv').config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/parts', partsRoutes);

app.use(errorMiddleware);

module.exports = app;
