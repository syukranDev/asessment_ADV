var express = require('express');
var router = express.Router();

const db = require('../model/db.js');
const { v4: uuidv4 } = require('uuid');
const Op = db.Sequelize.Op;
const sq = db.sequelize;

const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  // username === name
  const { username, password, email , role_type} = req.body;
  if (!username || !password || !email) {
    return res.status(422).json({ status: 'failed', errMsg: 'All fields are required.' });
  }

  try {
    const existingUser = await db.users.findOne({ where: { name: username }, raw: true });
    if (existingUser) {
      return res.status(409).json({ status: 'failed', errMsg: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const lastUser = await db.users.findOne({
      order: [['id', 'DESC']],
      attributes: ['id'],
      raw: true
    });

    const newId = lastUser ? lastUser.id + 1 : 1;
  
    const newUser = await db.users.create({
      id: newId,
      name: username,
      password: hashedPassword,
      email,
      role_type: role_type ?? 'u' // notedev: default value
    });

    return res.status(200).json({
      status: 'success',
      message: 'User registered successfully.',
      user_id: newUser.id
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ errMsg: 'Internal Server Error - Register API failed' });
  }
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(442).json({ status: 'failed', errMsg: 'Username and password required.' });

  try {
    const user = await db.users.findOne({ where: { name: username }, raw: true });
    if (!user) return res.status(422).json({ errMsg: 'Username or password is wrong' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(422).json({ errMsg: 'Username or password is wrong' });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role_type: user.role_type },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({ 
      status: '200', 
      message: 'Logged in',
      result: { 
        user_id: user.user_id, 
        access_token: token,
        token_type: 'Bearer',
        role_type: user.role_type,
        expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ')
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ errMsg: 'Internal Server Error - Login API failed' });
  }
});

// router.get('/list', async function(req, res, next) {
//   try {
//     let userData = await db.users.findAll({
//       raw: true,
//       logging: console.log
//     })

//     if (!userData || userData.length === 0) {
//       return res.status(422).json({ error: 'No users found' });
//     }

//     return res.status(200).json({
//       status: 'success',
//       data: userData
//     });
//   }
//   catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

module.exports = router;
