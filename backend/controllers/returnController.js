const { AssetIssue, Asset, Employee, AssetHistory } = require('../models');


exports.getIssuedAssets = async (req, res, next) => {
  try {
    const issued = await AssetIssue.findAll({
      where: { status: 'issued' },
      include: [
        { model: Asset, as: 'asset', attributes: ['id', 'asset_code', 'name'] },
        { model: Employee, as: 'employee', attributes: ['id', 'emp_code', 'name'] },
      ],
      order: [['issue_date', 'DESC']],
    });
    res.json(issued);
  } catch (err) {
    next(err);
  }
};


exports.returnAsset = async (req, res, next) => {
  try {
    const issue = await AssetIssue.findByPk(req.params.issueId, {
      include: [
        { model: Asset, as: 'asset' },
        { model: Employee, as: 'employee' },
      ],
    });

    if (!issue) return res.status(404).json({ message: 'Issue record not found' });
    if (issue.status === 'returned') return res.status(400).json({ message: 'Asset already returned' });

    const { actual_return_date, remarks } = req.body;


    await issue.update({
      status: 'returned',
      actual_return_date: actual_return_date || new Date(),
      remarks: remarks || issue.remarks,
    });


    await issue.asset.update({ status: 'available' });


    await AssetHistory.create({
      asset_id: issue.asset_id,
      employee_id: issue.employee_id,
      action: 'returned',
      action_date: actual_return_date || new Date(),
      remarks: remarks || `Returned by ${issue.employee.name}`,
    });

    res.json({ message: 'Asset returned successfully', issue });
  } catch (err) {
    next(err);
  }
};
