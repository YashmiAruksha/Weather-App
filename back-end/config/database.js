const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('weatherDB', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;