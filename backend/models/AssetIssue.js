const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AssetIssue = sequelize.define('AssetIssue', {
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
    allowNull: false,
    references: {
      model: 'employees',
      key: 'id',
    },
  },
  issue_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  expected_return_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  actual_return_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('issued', 'returned'),
    defaultValue: 'issued',
  },
}, {
  tableName: 'asset_issues',
  timestamps: true,
  underscored: true,
});

module.exports = AssetIssue;
