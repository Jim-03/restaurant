/**
 * @module orderedFoodController
 * @description An ordered food controller module that contains APIs that handle requests from clients and responses from the backend
 */

const express = require('express');
const orderFoodApi = express.Router();
const service = require('../services/orderFoodService');
const statusCode = require('./getStatusCode');

/**
 * Retrieves food items in a specific order
 */
orderFoodApi.get('/api/orderFood/:id', (req, res) => {
  service.getByOrder(Number(req.params.id))
    .then(response => {
      res.status(statusCode(response.status)).json(response);
    });
});

/**
 * Adds a food item to a specific order
 */
orderFoodApi.post('/api/orderFood/:id', (req, res) => {
  service.addToOrder(Number(req.params.id), req.body)
    .then(response => {
      res.status(statusCode(response.status)).json(response);
    });
});

/**
 * Updates a food item in a specific order
 */
orderFoodApi.put('/api/orderFood/:id', (req, res) => {
  service.updateFoodItem(Number(req.params.id), req.body)
    .then(response => {
      res.status(statusCode(response.status)).json(response);
    });
});

/**
 * Deletes an ordered food item from an order
 */
orderFoodApi.delete('/api/orderFood/:id', (req, res) => {
  service.remove(Number(req.params.id))
    .then(response => {
      res.status(statusCode(response.status)).json(response);
    });
});

module.exports = orderFoodApi;
