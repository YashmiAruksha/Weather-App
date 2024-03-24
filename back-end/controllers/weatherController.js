const WeatherData = require('../models/WeatherData');
const { Sequelize, Op } = require('sequelize');
const sequelize = require('../config/database');

exports.getAllWeatherData = async (req, res, next) => {
  try {
    const latestWeatherData = await WeatherData.findAll({
      attributes: ['district', 'humidity', 'temperature', 'airPressure'],
      where: Sequelize.literal(`id IN (
        SELECT MAX(id)
        FROM weather_data
        GROUP BY district
      )`)
    });
    res.json(latestWeatherData);
  } catch (error) {
    next(error);
  }
};

exports.getWeatherDataByDistrict = async (req, res, next) => {
  const { district } = req.params;
  try {
    const weatherData = await WeatherData.findOne({ 
      attributes: ['district', 'humidity', 'temperature', 'airPressure'],
      where: { district }, 
      order: [['timestamp', 'DESC']] });
    res.json(weatherData);
  } catch (error) {
    next(error);
  }
};