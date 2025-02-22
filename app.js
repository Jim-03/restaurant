const PORT = 5123;
const HOST = 'localhost';
const express = require('express');
const { getDatabaseUrl, attemptDatabaseConnection } = require('./databaseUrl');
const app = express();

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
