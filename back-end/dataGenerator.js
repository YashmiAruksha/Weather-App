const { faker } = require('@faker-js/faker');
const sequelize = require('./config/database');
const WeatherData = require('./models/WeatherData');
const cron = require('node-cron');

function generateWeatherData() {
  const districts = ['Colombo', 'Kaluthara', 'Gampaha', 'Kandy', 'Galle', 'Matara', 'Hambanthota', 'Jaffna', 'Trincomalee', 'Ampara', 'Batticaloa', 'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle', 'Matale', 'Nuwara Eliya', 'Vavuniya', 'Mannar', 'Mullaitivu', 'Kilinochchi'];

  const weatherData = districts.map(district => {
    const temperature = faker.number.int({ min: 25, max: 35 }); // Temperature in Celsius
    const humidity = faker.number.int({ min: 60, max: 80 }); // Humidity in percentage
    const airPressure = faker.number.int({ min: 1000, max: 1015 }); // Air pressure in hPa

    let weatherType;

    // Determine weather type based on conditions
    if (temperature > 30 && humidity > 70) {
      weatherType = 'Rainy';
    } else if (temperature > 30) {
      weatherType = 'Sunny';
    } else if (humidity > 70) {
      weatherType = 'Cloudy';
    } else {
      weatherType = 'Windy';
    }

    return {
      district: district,
      temperature: temperature,
      humidity: humidity,
      airPressure: airPressure,
      weatherType: weatherType
    };
  });

  return weatherData;
}

async function insertWeatherData() {
  const data = generateWeatherData();

  try {
    await WeatherData.bulkCreate(data);
    console.log('Weather data inserted successfully');
  } catch (error) {
    console.error('Error inserting weather data:', error);
  }
}

exports.insertWeatherData = insertWeatherData;