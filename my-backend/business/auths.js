const db = require('../model/db.js');
const sq = db.sequelize;
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async function(req, res) {
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
        expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ') // KIV - check this later, get from token or generate sendiri 
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ errMsg: 'Internal Server Error - Login API failed' });
  }
}

exports.register = async function(req, res) {
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
}