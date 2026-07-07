const router = require('express').Router();
const { Employee, Category, Asset, AssetIssue, AssetHistory } = require('../models');

// GET / or /dashboard
router.get(['/', '/dashboard'], async (req, res, next) => {
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

        res.render('dashboard', {
            title: 'Dashboard',
            stats: {
                totalEmployees,
                totalAssets,
                availableAssets,
                issuedAssets,
                scrappedAssets,
                totalCategories,
            },
            recentHistory,
            activePage: 'dashboard',
        });
    } catch (err) {
        next(err);
    }
});

// GET /employees
router.get('/employees', async (req, res, next) => {
    try {
        const employees = await Employee.findAll({ order: [['created_at', 'DESC']] });
        res.render('employees', {
            title: 'Employees',
            employees,
            activePage: 'employees',
        });
    } catch (err) {
        next(err);
    }
});

// GET /categories
router.get('/categories', async (req, res, next) => {
    try {
        const categories = await Category.findAll({ order: [['name', 'ASC']] });
        res.render('categories', {
            title: 'Categories',
            categories,
            activePage: 'categories',
        });
    } catch (err) {
        next(err);
    }
});

// GET /assets
router.get('/assets', async (req, res, next) => {
    try {
        const assets = await Asset.findAll({
            include: [{ model: Category, as: 'category' }],
            order: [['created_at', 'DESC']],
        });
        const categories = await Category.findAll({ order: [['name', 'ASC']] });
        res.render('assets', {
            title: 'Assets',
            assets,
            categories,
            activePage: 'assets',
        });
    } catch (err) {
        next(err);
    }
});

// GET /stock
router.get('/stock', async (req, res, next) => {
    try {
        const categories = await Category.findAll({
            include: [{ model: Asset, as: 'assets' }],
            order: [['name', 'ASC']],
        });
        const stock = categories.map(cat => ({
            category: cat.name,
            categoryId: cat.id,
            total: cat.assets.length,
            available: cat.assets.filter(a => a.status === 'available').length,
            issued: cat.assets.filter(a => a.status === 'issued').length,
            scrapped: cat.assets.filter(a => a.status === 'scrapped').length,
        }));
        const totals = stock.reduce(
            (acc, s) => ({
                total: acc.total + s.total,
                available: acc.available + s.available,
                issued: acc.issued + s.issued,
                scrapped: acc.scrapped + s.scrapped,
            }),
            { total: 0, available: 0, issued: 0, scrapped: 0 }
        );
        res.render('stock', {
            title: 'Stock View',
            stock,
            totals,
            activePage: 'stock',
        });
    } catch (err) {
        next(err);
    }
});

// GET /issues
router.get('/issues', async (req, res, next) => {
    try {
        const issues = await AssetIssue.findAll({
            include: [
                { model: Asset, as: 'asset' },
                { model: Employee, as: 'employee' },
            ],
            order: [['created_at', 'DESC']],
        });
        const assets = await Asset.findAll({ where: { status: 'available' }, order: [['name', 'ASC']] });
        const employees = await Employee.findAll({ where: { is_active: true }, order: [['name', 'ASC']] });
        res.render('issues', {
            title: 'Issue Asset',
            issues,
            assets,
            employees,
            activePage: 'issues',
        });
    } catch (err) {
        next(err);
    }
});

// GET /returns
router.get('/returns', async (req, res, next) => {
    try {
        const issued = await AssetIssue.findAll({
            where: { status: 'issued' },
            include: [
                { model: Asset, as: 'asset' },
                { model: Employee, as: 'employee' },
            ],
            order: [['issue_date', 'DESC']],
        });
        res.render('returns', {
            title: 'Return Asset',
            issued,
            activePage: 'returns',
        });
    } catch (err) {
        next(err);
    }
});

// GET /history
router.get('/history', async (req, res, next) => {
    try {
        const history = await AssetHistory.findAll({
            include: [
                { model: Asset, as: 'asset', attributes: ['asset_code', 'name'] },
                { model: Employee, as: 'employee', attributes: ['emp_code', 'name'] },
            ],
            order: [['action_date', 'DESC'], ['created_at', 'DESC']],
        });
        res.render('history', {
            title: 'Asset History',
            history,
            activePage: 'history',
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
