const { AssetHistory, Asset, Employee } = require('../models');

const router = require('express').Router();

// GET /api/history
router.get('/', async (req, res, next) => {
  try {
    const { action, asset_id, employee_id } = req.query;
    const where = {};
    if (action) where.action = action;
    if (asset_id) where.asset_id = asset_id;
    if (employee_id) where.employee_id = employee_id;

    const history = await AssetHistory.findAll({
      where,
      include: [
        { model: Asset, as: 'asset', attributes: ['id', 'asset_code', 'name'] },
        { model: Employee, as: 'employee', attributes: ['id', 'emp_code', 'name'] },
      ],
      order: [['action_date', 'DESC'], ['created_at', 'DESC']],
    });
    res.json(history);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
