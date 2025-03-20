/**
 * @module userController
 * @description A controller for the user API that receives requests and sends responses to and fro from client/server
 */

const service = require('../services/userService');
const express = require('express');
const userApi = express.Router();
const statusCode = require('./getStatusCode');

userApi.get('/api/user', (req, res) => {
  service.getAll()
    .then(response => {
      res.status(statusCode(response.status)).json(response);
    });
});

userApi.post('/api/user', (req, res) => {
  service.add(req.body)
    .then(response => {
      res.status(statusCode(response.status)).json(response);
    });
});

userApi.post('/api/user/authenticate', (req, res) => {
  service.authenticate(req.body)
    .then(response => {
      res.status(statusCode(response.status)).json(response);
    });
});

userApi.get('/api/user/:id', (req, res) => {
  service.getById(Number(req.params.id))
    .then(response => {
      res.status(statusCode(response.status)).json(response);
    });
});

userApi.put('/api/user/:id', (req, res) => {
  service.update(Number(req.params.id), req.body)
    .then(response => {
      res.status(statusCode(response.status)).json(response);
    });
});

userApi.delete('/api/user/:id', (req, res) => {
  service.remove(Number(req.params.id))
    .then(response => {
      res.status(statusCode(response.status)).json(response);
    });
});
module.exports = userApi;
