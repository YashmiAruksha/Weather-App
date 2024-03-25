const WeatherData = require('../models/WeatherData');

exports.createWeatherData = async (data) => {
  try {
    await WeatherData.create(data);
  } catch (error) {
    throw error;
  }
};