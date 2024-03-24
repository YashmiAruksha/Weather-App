const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

router.get('/api/weather', weatherController.getAllWeatherData);
router.get('/api/weather/:district', weatherController.getWeatherDataByDistrict);

module.exports = router;