const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asset = sequelize.define('Asset', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  asset_code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id',
    },
  },
  serial_number: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  purchase_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  purchase_cost: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
  condition: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'Good',
  },
  status: {
    type: DataTypes.ENUM('available', 'issued', 'scrapped'),
    defaultValue: 'available',
  },
}, {
  tableName: 'assets',
  timestamps: true,
  underscored: true,
});

module.exports = Asset;
