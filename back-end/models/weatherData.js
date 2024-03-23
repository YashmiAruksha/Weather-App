const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WeatherData = sequelize.define('weather_data', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  district: {
    type: DataTypes.STRING,
    allowNull: false
  },
  temperature: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  humidity: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  airPressure: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false
  },
  weatherType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = WeatherData;