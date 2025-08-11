var express = require('express');
var router = express.Router();

const db = require('../model/db.js');
const { v4: uuidv4 } = require('uuid');
const Op = db.Sequelize.Op;
const sq = db.sequelize;

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/list', async function(req, res, next) {
  try {
    let userData = await db.users.findAll({
      raw: true,
      logging: console.log
    })

    if (!userData || userData.length === 0) {
      return res.status(422).json({ error: 'No users found' });
    }

    return res.status(200).json({
      status: 'success',
      data: userData
    });
  }
  catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
