const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Part = sequelize.define('Part', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  brand: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT, defaultValue: 0 },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  category: { type: DataTypes.STRING },
  image_url: { type: DataTypes.STRING }, // ✅ new column
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'parts',
  timestamps: false
});

module.exports = Part;
