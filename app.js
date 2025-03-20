const express = require('express');
const { getDatabaseUrl, attemptDatabaseConnection } = require('./databaseUrl');
const htmlRoute = require('./controllers/htmlRouter');
const foodApi = require('./controllers/foodController');
const userApi = require('./controllers/userController');
const categoryApi = require('./controllers/categoryController');
const orderApi = require('./controllers/orderController')
const orderFoodApi = require('./controllers/orderFoodController')

const PORT = 5123;
const HOST = 'localhost';
const app = express();

app.set('views', 'templates');
app.use(express.static('public'));

app.use(express.json());

app.use(foodApi);
app.use(htmlRoute);
app.use(userApi);
app.use(categoryApi);
app.use(orderApi)
app.use(orderFoodApi)

async function startServer () {
  try {
    // Get the database url
    const url = getDatabaseUrl();

    // Attempt connecting to the database
    const connection = await attemptDatabaseConnection(url);

    if (!connection) return;

    // Start the app
    app.listen(PORT, HOST, () => {
      console.log(`Server started at http://${HOST}:${PORT}/`);
    });
  } catch (error) {
    console.error(`App failed to start: ${error.message}`);
  }
}

startServer();
