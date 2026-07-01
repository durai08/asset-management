const router = require('express').Router();
const ctrl = require('../controllers/assetController');

router.get('/stock', ctrl.getStock);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.put('/:id/scrap', ctrl.scrap);

module.exports = router;
