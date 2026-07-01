const router = require('express').Router();
const ctrl = require('../controllers/returnController');

router.get('/', ctrl.getIssuedAssets);
router.put('/:issueId', ctrl.returnAsset);

module.exports = router;
