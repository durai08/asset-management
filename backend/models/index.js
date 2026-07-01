const sequelize = require('../config/database');
const Employee = require('./Employee');
const Category = require('./Category');
const Asset = require('./Asset');
const AssetIssue = require('./AssetIssue');
const AssetHistory = require('./AssetHistory');


Category.hasMany(Asset, { foreignKey: 'category_id', as: 'assets' });
Asset.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });


Asset.hasMany(AssetIssue, { foreignKey: 'asset_id', as: 'issues' });
AssetIssue.belongsTo(Asset, { foreignKey: 'asset_id', as: 'asset' });


Employee.hasMany(AssetIssue, { foreignKey: 'employee_id', as: 'issues' });
AssetIssue.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });


Asset.hasMany(AssetHistory, { foreignKey: 'asset_id', as: 'history' });
AssetHistory.belongsTo(Asset, { foreignKey: 'asset_id', as: 'asset' });


Employee.hasMany(AssetHistory, { foreignKey: 'employee_id', as: 'historyRecords' });
AssetHistory.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

module.exports = {
  sequelize,
  Employee,
  Category,
  Asset,
  AssetIssue,
  AssetHistory,
};
