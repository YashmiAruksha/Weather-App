const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const weatherRoutes = require('./routes/weatherRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const cron = require('node-cron');
const { insertWeatherData } = require('./dataGenerator');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

const app = express();

//CORS 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Middleware
app.use(bodyParser.json());

// Swagger
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Routes
app.use(weatherRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MySQL
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to MySQL database');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Schedule data generation to occur every 2 hours
cron.schedule('0 */2 * * *', () => {
  console.log('Generating weather data...');
  insertWeatherData();
});
// cron.schedule('*/5 * * * *', () => {
//   console.log('Generating weather data...');
//   insertWeatherData();
// });

// Start the cron job
console.log('Data generation scheduled every 5 minutes');