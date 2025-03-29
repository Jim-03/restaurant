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
htmlRoute.get('/chef', (req, res) => {
  res.sendFile(template('chef.html'));
});

/**
 * The cashier route
 */
htmlRoute.get("/cashier", (req, res) => {
  res.sendFile(template('cashier.html'))
})

/**
 * The waiter/waitress route
 */
htmlRoute.get("/server", (req, res) => {
  res.sendFile(template("thewaiter.html"))
})

/**
 * The admin route
 */
htmlRoute.get("/admin", (req, res) => {
  res.sendFile(template("admin.html"))
})

/**
 * The report route
 */
htmlRoute.get("/report", (req, res) => {
  res.sendFile(template("report.html"))
})
module.exports = htmlRoute;
