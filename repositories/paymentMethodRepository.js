/**
 * @module paymentMethodRepository
 * @description A module that handles the database operations of payment methods
 */

const paymentMethodModel = require('../models/payment_method');

/**
 * Retrieves a list of payment methods
 * @returns {Promise<paymentMethodModel[] | null>} A list of all payment methods or null
 * @throws {Error} In case of any errors
 */
async function findAll () {
  try {
    return await paymentMethodModel.findAll();
  } catch (e) {
    throw new Error(
      `An error occurred while fetching the list of payment methods: ${e.message}`
    );
  }
}

/**
 * Retrieves a payment method by its primary key
 * @param {number} id The payment method's primary key
 * @returns {Promise<paymentMethodModel | null>} The payment method's data or null
 * @throws {Error} In case of any errors
 */
async function findById (id) {
  try {
    return await paymentMethodModel.findByPk(id);
  } catch (e) {
    throw new Error(
      `An error occurred while fetching the payment method: ${e.message}`
    );
  }
}

/**
 * Adds a new payment method record
 * @param {paymentMethodModel} paymentMethod The new payment method's data
 * @returns {Promise<void>} A promise that resolves when the payment method is added
 * @throws {Error} In case of any errors
 */
async function save (paymentMethod) {
  try {
    await paymentMethodModel.create(paymentMethod);
  } catch (e) {
    throw new Error(
      `An error occurred while adding the payment method: ${e.message}`
    );
  }
}

/**
 * Updates a payment method
 * @param {Object} oldData
 * @param {paymentMethodModel} newData
 * @returns {Promise<void>} A promise that resolves when the payment method is updated
 * @throws {Error} In case of any errors
 */
async function update (oldData, newData) {
  try {
    await paymentMethodModel.update(newData, { where: oldData });
  } catch (e) {
    throw new Error(
      `An error occurred while updating the payment method: ${e.message}`
    );
  }
}

/**
 * Removes a payment method record
 * @param {paymentMethod} paymentMethod The payment method to be deleted
 * @returns {Promise<void>} A promise that resolves when the payment method is deleted
 * @throws {Error} In case of any errors
 */
async function remove (paymentMethod) {
  try {
    await paymentMethodModel.destroy();
  } catch (e) {
    throw new Error(
      `An error occurred while deleting the payment method: ${e.message}`
    );
  }
}

module.exports = {
  findAll,
  findById,
  save,
  update,
  remove
};
