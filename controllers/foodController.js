const express = require('express');
const { getFoodItemByName, getFoodList, getByCategory, addFood, updateItem, deleteFood } = require('../services/foodService');
const foodAPI = express.Router();
const getStatusCode = require('./getStatusCode');

foodAPI.get('/api/food/list/:name', (req, res) => {
  getFoodList(req.params.name)
    .then(response => {
      res.status(getStatusCode(response.status)).json(response);
    });
});

foodAPI.get('/api/food/category/:id', (req, res) => {
  getByCategory(Number(req.params.id))
    .then(response => {
      res.status(getStatusCode(response.status)).json(response);
    });
});
foodAPI.get('/api/food/:name', (req, res) => {
  getFoodItemByName(req.params.name)
    .then(response => {
      res.status(getStatusCode(response.status)).json(response);
    });
});
foodAPI.post('/api/food', (req, res) => {
  addFood(req.body)
    .then(response => {
      res.status(getStatusCode(response.status)).json(response);
    });
});

foodAPI.put('/api/food/:id', (req, res) => {
  updateItem(Number(req.params.id), req.body)
    .then(response => {
      res.status(getStatusCode(response.status)).json(response);
    });
});

foodAPI.delete('/api/food/:id', (req, res) => {
  deleteFood(Number(req.params.id))
    .then(response => {
      res.status(getStatusCode(response.status)).json(response);
    });
});

module.exports = foodAPI;
