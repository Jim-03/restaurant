/**
 * @module orderRepository
 * @description A repository module that directly interacts with the orders table in the database
 */

const orderModel = require('../models/order_model');
const { Op } = require('sequelize');

/**
 * Retrieves an orders data
 * @param id The order's primary key
 * @returns {Promise<orderModel>} The order's data
 * @throws {Error} In case of any error
 */
async function findById (id) {
  try {
    return await orderModel.findByPk(id);
  } catch (e) {
    throw new Error(`An error has occurred while fetching the order: ${e.message}`);
  }
}

/**
 * Retrieves a list of orders that aren't completed
 * @returns {Promise<orderModel[] | null>} The list of incomplete orders or null
 * @throws {Error} In case of any errors
 */
async function findByIncomplete () {
  try {
    return await orderModel.findAll({
      where: {
        [Op.or]: [
          { orderStatus: 'incomplete' },
          { orderStatus: 'processing' }
        ]
      }
    });
  } catch (e) {
    throw new Error(`An error has occurred when fetching the list of incomplete orders: ${e.message}`);
  }
}

/**
 * Retrieves a list of orders made by a waiter/waitress
 * @param {number} id The waiter's/waitress' primary key
 * @returns {Promise<orderModel[] | null>} The list of orders or null
 * @throws {Error} In case of any errors
 */
async function findByServer (id) {
  try {
    return await orderModel.findAll({ where: { waiter_id: id } });
  } catch (e) {
    throw new Error(`An error has occurred while fetching the list of orders made by the server: ${e.message}`);
  }
}

/**
 * Retrieves a list of orders made  between two dates
 * @param start
 * @param end
 * @returns {Promise<orderModel[] | null>} An object containing the list of orders or null
 * @throws {Error} In case of any errors
 */
async function findByDateRange (start, end) {
  try {
    return await orderModel.findAll({ where: { createdAt: { [Op.between]: [start, end] } } });
  } catch (e) {
    throw new Error(`An error has occurred while fetching the list of orders: ${e.message}`);
  }
}

/**
 * Adds a new order to the database
 * @param {Object} order The order's data
 * @returns {Promise<orderModel>} The newly created database record
 * @throws {Error} In case of any errors
 */
async function save (order) {
  try {
    return await orderModel.create(order);
  } catch (e) {
    throw new Error(`An error has occurred while creating the order: ${e.message}`);
  }
}

/**
 * Updates an existing record's data
 * @param {orderModel} oldData
 * @param {Object} newData
 * @returns {Promise<void>} A promise that resolves when an order is updated
 * @throws {Error} In case of any errors
 */
async function update (oldData, newData) {
  try {
    return await oldData.update(newData);
  } catch (e) {
    throw new Error(`An error has occurred while updating the order: ${e.message}`);
  }
}

/**
 * Deletes an order's record from the database
 * @param {orderModel} order The order's data
 * @return {Promise<void>} A promise that resolves when an order is deleted
 * @throws {Error} In case of any errors
 */
async function remove (order) {
  try {
    await order.destroy();
  } catch (e) {
    throw new Error(`An error has occurred while deleting the order: ${e.message}`);
  }
}
module.exports = { findById, findByIncomplete, findByServer, findByDateRange, save, update, remove };
