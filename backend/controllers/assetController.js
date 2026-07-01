const { Asset, Category, AssetHistory } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const assets = await Asset.findAll({
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']],
    });
    res.json(assets);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const asset = await Asset.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
    });
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    res.json(asset);
  } catch (err) {
    next(err);
  }
};


exports.create = async (req, res, next) => {
  try {
    const { asset_code, name, category_id, serial_number, purchase_date, purchase_cost, condition } = req.body;
    const asset = await Asset.create({
      asset_code, name, category_id, serial_number, purchase_date, purchase_cost, condition,
    });
    const full = await Asset.findByPk(asset.id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
    });
    res.status(201).json(full);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Asset code already exists' });
    }
    next(err);
  }
};


exports.update = async (req, res, next) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    const { asset_code, name, category_id, serial_number, purchase_date, purchase_cost, condition, status } = req.body;
    await asset.update({ asset_code, name, category_id, serial_number, purchase_date, purchase_cost, condition, status });

    const full = await Asset.findByPk(asset.id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
    });
    res.json(full);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Asset code already exists' });
    }
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    await asset.destroy();
    res.json({ message: 'Asset deleted successfully' });
  } catch (err) {
    next(err);
  }
};


exports.scrap = async (req, res, next) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    if (asset.status === 'issued') return res.status(400).json({ message: 'Cannot scrap an issued asset. Return it first.' });

    await asset.update({ status: 'scrapped' });

    await AssetHistory.create({
      asset_id: asset.id,
      employee_id: null,
      action: 'scrapped',
      action_date: new Date(),
      remarks: req.body.remarks || 'Asset scrapped',
    });

    res.json({ message: 'Asset scrapped successfully', asset });
  } catch (err) {
    next(err);
  }
};


exports.getStock = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      include: [{
        model: Asset,
        as: 'assets',
        attributes: ['id', 'asset_code', 'name', 'status', 'condition', 'serial_number'],
      }],
      order: [['name', 'ASC']],
    });

    const stock = categories.map(cat => ({
      category: cat.name,
      categoryId: cat.id,
      total: cat.assets.length,
      available: cat.assets.filter(a => a.status === 'available').length,
      issued: cat.assets.filter(a => a.status === 'issued').length,
      scrapped: cat.assets.filter(a => a.status === 'scrapped').length,
      assets: cat.assets,
    }));

    res.json(stock);
  } catch (err) {
    next(err);
  }
};
