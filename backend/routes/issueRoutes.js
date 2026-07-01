const router = require('express').Router();
const ctrl = require('../controllers/issueController');

router.get('/', ctrl.getAll);
router.post('/', ctrl.issueAsset);

module.exports = router;
