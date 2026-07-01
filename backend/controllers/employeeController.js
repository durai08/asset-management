const { Employee } = require('../models');


exports.getAll = async (req, res, next) => {
  try {
    const employees = await Employee.findAll({ order: [['created_at', 'DESC']] });
    res.json(employees);
  } catch (err) {
    next(err);
  }
};


exports.getById = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    next(err);
  }
};


exports.create = async (req, res, next) => {
  try {
    const { emp_code, name, department, designation, email, phone } = req.body;
    const employee = await Employee.create({ emp_code, name, department, designation, email, phone });
    res.status(201).json(employee);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Employee code already exists' });
    }
    next(err);
  }
};


exports.update = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const { emp_code, name, department, designation, email, phone, is_active } = req.body;
    await employee.update({ emp_code, name, department, designation, email, phone, is_active });
    res.json(employee);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Employee code already exists' });
    }
    next(err);
  }
};


exports.remove = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    await employee.destroy();
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    next(err);
  }
};
