const router = require('./extensions').Router();
const models = router.models;

// remove after dev
const sync = async (req, res) => {

	res.json('sync');
};

router.getS('/sync', sync, false);
module.exports = router;
