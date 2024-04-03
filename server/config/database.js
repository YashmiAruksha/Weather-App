const { Sequelize } = require('sequelize');
require('dotenv').config();

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;

const sequelize = new Sequelize('weatherDB', user, password, {
  host: host,
  dialect: 'mysql'
});

module.exports = sequelize;