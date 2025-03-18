const express = require('express');
const htmlRoute = express.Router();
const template = require('../templates/template');

/**
 * The main route
 */
htmlRoute.get('/', (req, res) => {
  res.sendFile(template('main-menu.html'));
});

/**
 * The login route
 */
htmlRoute.get('/login', (req, res) => {
  res.sendFile(template('login.html'));
});

/**
 * The chef route
 */
htmlRoute.get("/chef", (req, res) => {
  res.sendFile(template('chef.html'))
})
module.exports = htmlRoute;
