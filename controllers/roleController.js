/**
 * @module roleController
 * @description A controller module that contains the API to the roles service.
 *      It handles requests from the client and responses from the server
 */

const service = require('../services/roleService');
const express = require('express');
const roleApi = express.Router();
const statusCode = require('./getStatusCode');

roleApi.get('/api/role', (req, res) => {
  service.getAll()
    .then(response => {
      res.status(statusCode(response.status)).json(response);
    });
});

roleApi.post('/api/role', (req, res) => {
  service.add(req.body)
    .then(response => {
      res.status(statusCode(response.status)).json(response);
    });
});

roleApi.get('/api/role/:id', (req, res) => {
  service.get(Number(req.params.id))
    .then(response => {
      res.status(statusCode(response.status)).json(response);
    });
});

roleApi.put('/api/role/:id', (req, res) => {
  service.update(Number(req.params.id), req.body)
    .then(response => {
      res.status(statusCode(response.status)).json(response);
    });
});

roleApi.delete('/api/role/:id', (req, res) => {
  service.remove(Number(req.params.id))
    .then(response => {
      res.status(statusCode(response.status)).json(response);
    });
});
module.exports = roleApi;
