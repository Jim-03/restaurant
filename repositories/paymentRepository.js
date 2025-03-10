/**
 * @module paymentRepository
 * @description A repository that handles the database operations for the payment model
 */

const paymentModel = require('../models/payment');
const { Op } = require('sequelize');

/**
 * Adds a new payment to the database
 * @param {Object} payment The new payment's details
 * @returns {Promise<void>} A promise that resolves when the payment is saved
 * @throws {Error} In case of any errors
 */
async function save (payment) {
  try {
    await paymentModel.create(payment);
  } catch (e) {
    throw new Error(`An error occurred while saving the payment: ${e.message}`);
  }
}

/**
 * Retrieves a payment record by its id
 * @param {number} id The payment's primary key
 * @returns {Promise<paymentModel>} A promise that resolves with the payment
 * @throws {Error} In case of any errors
 */
async function findById (id) {
  try {
    return await paymentModel.findByPk(id);
  } catch (e) {
    throw new Error(
      `An error occurred while retrieving the payment: ${e.message}`
    );
  }
}

/**
 * Retrieves all payments within a date range
 * @param {Date} start The start date
 * @param {Date} end The end date
 * @returns {Promise<paymentModel[] | null>} A promise that resolves with the payments
 * @throws {Error} In case of any errors
 */
async function findByDateRange (start, end) {
  try {
    return await paymentModel.findAll({
      where: {
        createdAt: {
          [Op.between]: [start, end]
        }
      }
    });
  } catch (e) {
    throw new Error(
      `An error occurred while retrieving the payment: ${e.message}`
    );
  }
}
/**
 * Removes a payment record from the database
 * @param {paymentModel} payment The payment's data
 * @returns {Promise<void>} A promise that resolves when the payment is removed
 * @throws {Error} In case of any errors
 */
async function remove (payment) {
  try {
    await paymentModel.delete(payment);
  } catch (e) {
    throw new Error(
      `An error occurred while deleting the payment: ${e.message}`
    );
  }
}
module.exports = {
  save,
  findById,
  findByDateRange,
  remove
};
