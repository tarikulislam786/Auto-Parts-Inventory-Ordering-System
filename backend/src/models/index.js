const sequelize = require('../config/db');
const User = require('./user.model');
const Part = require('./part.model');

module.exports = { sequelize, User, Part };
