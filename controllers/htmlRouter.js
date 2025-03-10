const express = require('express');
const htmlRoute = express.Router();
const template = require('../templates/template');

/**
 * The main route
 */
htmlRoute.get('/', (req, res) => {
  res.sendFile(template('main-menu.html'));
});

module.exports = htmlRoute;
