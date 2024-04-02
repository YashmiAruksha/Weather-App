const WeatherData = require('../models/weatherData');

exports.createWeatherData = async (data) => {
  try {
    await WeatherData.create(data);
  } catch (error) {
    throw error;
  }
};