const { AssetIssue, Asset, Employee, AssetHistory } = require('../models');

// GET /api/issues  (all current issues)
exports.getAll = async (req, res, next) => {
  try {
    const issues = await AssetIssue.findAll({
      include: [
        { model: Asset, as: 'asset', attributes: ['id', 'asset_code', 'name'] },
        { model: Employee, as: 'employee', attributes: ['id', 'emp_code', 'name'] },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json(issues);
  } catch (err) {
    next(err);
  }
};

// POST /api/issues  (issue an asset to an employee)
exports.issueAsset = async (req, res, next) => {
  try {
    const { asset_id, employee_id, issue_date, expected_return_date, remarks } = req.body;

    // Validate asset availability
    const asset = await Asset.findByPk(asset_id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    if (asset.status !== 'available') {
      return res.status(400).json({ message: `Asset is currently "${asset.status}" and cannot be issued` });
    }

    // Validate employee
    const employee = await Employee.findByPk(employee_id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Create issue record
    const issue = await AssetIssue.create({
      asset_id, employee_id,
      issue_date: issue_date || new Date(),
      expected_return_date,
      remarks,
    });

    // Update asset status
    await asset.update({ status: 'issued' });

    // Create history record
    await AssetHistory.create({
      asset_id,
      employee_id,
      action: 'issued',
      action_date: issue_date || new Date(),
      remarks: remarks || `Issued to ${employee.name}`,
    });

    const full = await AssetIssue.findByPk(issue.id, {
      include: [
        { model: Asset, as: 'asset', attributes: ['id', 'asset_code', 'name'] },
        { model: Employee, as: 'employee', attributes: ['id', 'emp_code', 'name'] },
      ],
    });

    res.status(201).json(full);
  } catch (err) {
    next(err);
  }
};
