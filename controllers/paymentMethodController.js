/**
 *  @module paymentMethodController
 * @description A controller module containing all the paymentMethodAPIs for handling payment method requests and responses
 */

const express = require('express');
const paymentMethodApi = express.Router();
const service = require('../services/paymentMethodService');
const statusCode = require('./getStatusCode');

/**
 * Retrieves all payment methods
 */
paymentMethodApi.get('/api/paymentMethod', (req, res) => {
  service.getAll().then((response) => {
    res.status(statusCode(response.status)).json(response);
  });
});

/**
 * Retrieves a payment method
 */
paymentMethodApi.get('/api/paymentMethod/:id', (req, res) => {
  service.get(Number(req.params.id)).then((response) => {
    res.status(statusCode(response.status)).json(response);
  });
});

/**
 * Adds a new payment method
 */
paymentMethodApi.post('/api/paymentMethod', (req, res) => {
  service.add(req.body).then((response) => {
    res.status(statusCode(response.status)).json(response);
  });
});

/**
 * Updates a payment method
 */
paymentMethodApi.put('/api/paymentMethod/:id', (req, res) => {
  service.update(Number(req.params.id), req.body).then((response) => {
    res.status(statusCode(response.status)).json(response);
  });
});

/**
 * Removes a payment method
 */
paymentMethodApi.delete('/api/paymentMethod/:id', (req, res) => {
  service.remove(Number(req.params.id)).then((response) => {
    res.status(statusCode(response.status)).json(response);
  });
});

module.exports = paymentMethodApi;
