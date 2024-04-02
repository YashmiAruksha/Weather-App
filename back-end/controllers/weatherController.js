const WeatherData = require('../models/weatherData');
const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

exports.getAllWeatherData = async (req, res, next) => {
  try {
    const latestWeatherData = await WeatherData.findAll({
      attributes: ['district', 'humidity', 'temperature', 'airPressure', 'weatherType', 'geocode'],
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
      attributes: ['district', 'humidity', 'temperature', 'airPressure', 'weatherType'],
      where: Sequelize.literal(`district = '${district}' AND id = (SELECT MAX(id) FROM weather_data WHERE district = '${district}')`), 
      order: [['timestamp', 'DESC']] });
    res.json(weatherData);
  } catch (error) {
    next(error);
  }
};