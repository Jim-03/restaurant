const service = require('../services/categoryService');
const express = require('express');
const categoryApi = express.Router();
const getStatusCode = require('./getStatusCode');

categoryApi.get('/api/category', (req, res) => {
  service.getAll()
    .then(response => {
      res.status(getStatusCode(response.status)).json(response);
    });
});

categoryApi.post('/api/category', (req, res) => {
  service.addCategory(req.body)
    .then(response => {
      res.status(getStatusCode(response.status)).json(response);
    });
});

categoryApi.put('/api/category/:id', (req, res) => {
  service.updateCategory(Number(req.params.id), req.body)
    .then(response => {
      res.status(getStatusCode(response.status)).json(response);
    });
});

categoryApi.delete('/api/category/:id', (req, res) => {
  service.deleteCategory(Number(req.params.id))
    .then(response => {
      res.status(getStatusCode(response.status)).json(response);
    });
});

module.exports = categoryApi;
