var express = require('express');
var router = express.Router();

const db = require('../model/db.js');
const Op = db.Sequelize.Op;
const sq = db.sequelize;
const { apiTokenVerify } = require('../middlewares/auth.js');

const biz = require('../business/listings.js');

router.get('/listing', apiTokenVerify, async function(req, res, next) {
  biz.webapp_listings(req, res);
});

router.get('/o/:id', apiTokenVerify, async function(req, res, next) {
  biz.read_listings(req, res);
});

router.put('/update/:id', apiTokenVerify, async function(req, res, next) {
  biz.update_listings(req, res);
});

router.delete('/delete/:id', apiTokenVerify, async function(req, res, next) {
  biz.delete_listings(req, res);
});

module.exports = router;
