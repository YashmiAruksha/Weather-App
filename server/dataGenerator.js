const { faker } = require('@faker-js/faker');
const sequelize = require('./config/database');
const WeatherData = require('./models/weatherData');
const cron = require('node-cron');

function generateWeatherData() {
  const districts = [
    {
      geocode: [6.93194, 79.84778],
      name: "Colombo"
    },
    {
      geocode: [6.5854, 79.9607],
      name: "Kaluthara"
    },
    {
      geocode: [7.0840,80.0098],
      name: "Gampaha"
    },
    {
      geocode: [7.2906, 80.6337],
      name: "Kandy"
    },
    {
      geocode: [6.0329, 80.2168],
      name: "Galle"
    },
    {
      geocode: [5.9496, 80.5469],
      name: "Matara"
    },
    {
      geocode: [6.1429, 81.1212],
      name: "Hambanthota"
    },
    {
      geocode: [9.6615, 80.0255],
      name: "Jaffna"
    },
    {
      geocode: [8.5874, 81.2152],
      name: "Trincomalee"
    },
    {
      geocode: [7.3018, 81.6747],
      name: "Ampara"
    },
    {
      geocode: [7.7249, 81.6967],
      name: "Batticaloa"
    },
    {
      geocode: [7.4818, 80.3609],
      name: "Kurunegala"
    },
    {
      geocode: [8.0408, 79.8394],
      name: "Puttalam"
    },
    {
      geocode: [8.3114, 80.4037],
      name: "Anuradhapura"
    },
    {
      geocode: [7.9403, 81.0188],
      name: "Polonnaruwa"
    },
    {
      geocode: [6.9934, 81.0550],
      name: "Badulla"
    },
    {
      geocode: [6.8906, 81.3454],
      name: "Monaragala"
    },
    {
      geocode: [6.7055, 80.3848],
      name: "Ratnapura"
    },
    {
      geocode: [7.2513, 80.3464],
      name: "Kegalle"
    },
    {
      geocode: [7.4675, 80.6234],
      name: "Matale"
    },
    {
      geocode: [6.9497, 80.7891],
      name: "Nuwara Eliya"
    },
    {
      geocode: [8.7542, 80.4982],
      name: "Vavuniya"
    },
    {
      geocode: [8.9810, 79.9044],
      name: "Mannar"
    },
    {
      geocode: [9.2671, 80.8142],
      name: "Mullaitivu"
    },
    {
      geocode: [9.3803, 80.3770],
      name: "Kilinochchi"
    },
  ];

  const weatherData = districts.map(({name, geocode}) => {
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
      district: name,
      temperature: temperature,
      humidity: humidity,
      airPressure: airPressure,
      weatherType: weatherType,
      geocode: geocode
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