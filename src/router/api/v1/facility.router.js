const router = require('../../extensions').Router();
const models = router.models;
let fetch = require('node-fetch');

const { ThrowReturn } = require('../../extensions');
const redisPool = require('../../../utils/redispool');


const list = async (req, res) => {
    res.sendData(null, 'Success!')
};


router.postS('/list', list, false);


module.exports = router;
