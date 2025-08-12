var express = require('express');
var router = express.Router();

const db = require('../model/db.js');
const Op = db.Sequelize.Op;
const sq = db.sequelize;
const biz = require('../business/auths.js');


router.post('/register', async (req, res) => {
  biz.register(req, res);
});

router.post('/login', async (req, res, next) => {
  biz.login(req, res);
});

module.exports = router;
