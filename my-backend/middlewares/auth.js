var express = require('express');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function apiTokenVerify(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ errMsg: 'No token provided.' });
  }
  const token = authHeader.split(' ')[1];

  console.log('Token received:', token); // Debugging line

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ errMsg: 'Invalid or expired token.' });
    req.token = decoded;
    next();
  });
}

module.exports = {
  apiTokenVerify
};