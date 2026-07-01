const { Employee, Asset, AssetIssue, AssetHistory, Category } = require('../models');


exports.getStats = async (req, res, next) => {
  try {
    const totalEmployees = await Employee.count({ where: { is_active: true } });
    const totalAssets = await Asset.count();
    const availableAssets = await Asset.count({ where: { status: 'available' } });
    const issuedAssets = await Asset.count({ where: { status: 'issued' } });
    const scrappedAssets = await Asset.count({ where: { status: 'scrapped' } });
    const totalCategories = await Category.count();

    const recentHistory = await AssetHistory.findAll({
      include: [
        { model: Asset, as: 'asset', attributes: ['asset_code', 'name'] },
        { model: Employee, as: 'employee', attributes: ['emp_code', 'name'] },
      ],
      order: [['created_at', 'DESC']],
      limit: 10,
    });

    res.json({
      stats: {
        totalEmployees,
        totalAssets,
        availableAssets,
        issuedAssets,
        scrappedAssets,
        totalCategories,
      },
      recentHistory,
    });
  } catch (err) {
    next(err);
  }
};
