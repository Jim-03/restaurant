/**
 * @module orderController
 * @description A controller module having the APIs for an order.
 * Handles requests and responses to and fro from client and server
 */

const express = require('express');
const orderApi = express.Router();
const service = require('../services/orderService');
const statusCode = require('./getStatusCode');

orderApi.get('/api/order/unfinished', (req, res) => {
  service.getIncompleteOrders()
    .then(response => {
      res.status(statusCode(response.status)).json(response);
    });
});

orderApi.post('/api/order/date', (req, res) => {
  service.getByDateRange(req.body)
    .then(response => {
      res.status(statusCode(response.status)).json(response);
    });
});
orderApi.get('/api/order/server/:id', (req, res) => {
  service.getByServer(Number(req.params.id))
    .then(response => {
      res.status(statusCode(response.status)).json(response);
    });
});
orderApi.get('/api/order/:id', (req, res) => {
  service.get(Number(req.params.id))
    .then(response => {
      res.status(statusCode(response.status)).json(response);
    });
});

orderApi.post('/api/order', (req, res) => {
  service.add(req.body)
    .then(response => {
      res.status(statusCode(response.status)).json(response);
    });
});

orderApi.put('/api/order/:id', (req, res) => {
  service.update(Number(req.params.id), req.body)
    .then(response => {
      res.status(statusCode(response.status)).json(response);
    });
});

orderApi.delete('/api/order/:id', (req, res) => {
  service.remove(Number(req.params.id))
    .then(response => {
      res.status(statusCode(response.status)).json(response);
    });
});

module.exports = orderApi;
