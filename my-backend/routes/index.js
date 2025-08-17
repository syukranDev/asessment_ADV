var express = require('express');
var router = express.Router();

const db = require('../model/db.js');
const Op = db.Sequelize.Op;
const sq = db.sequelize;
const { apiTokenVerify } = require('../middlewares/auth.js');

const biz = require('../business/listings.js');

router.get('/', function(req, res, next) {
  res.json({ message: 'Your backend is running.' })
});

router.get('/listing', apiTokenVerify, async function(req, res, next) {
  biz.webapp_listings(req, res);
});

router.get('/api/listing', apiTokenVerify, async function(req, res, next) {
  biz.android_listings(req, res); //notedev: for mobile API
});

router.get('/listing/o/:id', apiTokenVerify, async function(req, res, next) {
  biz.read_listings(req, res);
});

router.put('/listing/update/:id', apiTokenVerify, async function(req, res, next) {
  biz.update_listings(req, res);
});

router.delete('/listing/delete/:id', apiTokenVerify, async function(req, res, next) {
  biz.delete_listings(req, res);
});

router.post('/listing/create', apiTokenVerify, async function(req, res, next) {
  biz.create_listings(req, res);
});

router.get('/user/listings', apiTokenVerify, async function(req, res, next) {
  biz.getUserList(req, res);
});
module.exports = router;
