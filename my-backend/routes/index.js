var express = require('express');
var router = express.Router();

const db = require('../model/db.js');
const Op = db.Sequelize.Op;
const sq = db.sequelize;
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { apiTokenVerify } = require('../middlewares/auth.js');

//TBA
router.get('/listing', apiTokenVerify, async function(req, res, next) {
  const {id, name, email, role_type} = req.token;

  // notedev: only 'u' can access
  if (role_type !== 'u') return res.status(403).json({ errMsg: `Access denied. Role type (${role_type}) not allowed.` });
  
  try {
    let listings = await db.listings.findAll({
      raw: true,
      logging: console.log
    })

    if (!listings || listings.length === 0) {
      return res.status(422).json({ error: `No listings data found for user_id - (${id})` });
    }

    return res.status(200).json({
      status: 'success',
      data: listings
    });
  }
  catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
