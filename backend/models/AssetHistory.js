const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AssetHistory = sequelize.define('AssetHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  asset_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'assets',
      key: 'id',
    },
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'employees',
      key: 'id',
    },
  },
  action: {
    type: DataTypes.ENUM('issued', 'returned', 'scrapped'),
    allowNull: false,
  },
  action_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'asset_history',
  timestamps: true,
  underscored: true,
});

module.exports = AssetHistory;
