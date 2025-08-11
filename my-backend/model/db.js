'use strict'

require('dotenv').config()
console.log(process.env)

const Sequelize = require('sequelize');

console.log('Database Configuration:', {
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  timezone: '+08:00',
  benchmark: true,
  pool: {
    max: 300,
    min: 10,
    idle: 600000
  },
  logging: false,
  alter: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// public schema
db.users = require('./users.js')(sequelize, Sequelize);
db.listings = require('./listings.js')(sequelize, Sequelize);

sequelize.sync();

module.exports = db;