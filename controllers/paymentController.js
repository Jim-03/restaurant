/**
 * @module paymentController
 *  @description A controller module containing all the paymentAPIs for handling payment requests and responses
 */

const express = require('express');
const paymentApi = express.Router();
const service = require('../services/paymentService');
const statusCode = require('./getStatusCode');

/**
 * Retrieves all payments within a specific month
 */
paymentApi.get('/api/payment/month/:month', (req, res) => {
  service.getByMonth(Number(req.params.month)).then((response) => {
    res.status(statusCode(response.status)).json(response);
  });
});

/**
 * Retrieves all payments within a specific year
 */
paymentApi.get('/api/payment/year/:year', (req, res) => {
  service.getByYear(Number(req.params.year)).then((response) => {
    res.status(statusCode(response.status)).json(response);
  });
});

/**
 * Retrieves a payment record
 */
paymentApi.get('/api/payment/:id', (req, res) => {
  service.get(Number(req.params.id)).then((response) => {
    res.status(statusCode(response.status)).json(response);
  });
});

/**
 * Adds a new payment record
 */
paymentApi.post('/api/payment', (req, res) => {
  service.add(req.body).then((response) => {
    res.status(statusCode(response.status)).json(response);
  });
});

/**
 * Updates a payment record
 */
paymentApi.put('/api/payment/:id', (req, res) => {
  service.update(Number(req.params.id), req.body).then((response) => {
    res.status(statusCode(response.status)).json(response);
  });
});

/**
 * Removes a payment record
 */
paymentApi.delete('/api/payment/:id', (req, res) => {
  service.remove(Number(req.params.id)).then((response) => {
    res.status(statusCode(response.status)).json(response);
  });
});

module.exports = paymentApi;
