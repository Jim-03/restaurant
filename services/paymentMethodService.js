/**
 * @module paymentMethodService
 * @description A module that handles the business logic of payment methods
 */

const repo = require('../repositories/paymentMethodRepository');

/**
 * Handles the retrieval of all payment methods
 * @returns {Promise<{
 *      status: "not_found" | "success" | "error",
 *      message: string
 * }>} An object containing the list of payment methods or null
 */
async function getAll () {
  try {
    // Fetch a list of all payment methods
    const paymentMethodsList = await repo.findAll();

    // Check if payment methods exist
    if (!paymentMethodsList || paymentMethodsList.length === 0) {
      return {
        status: 'not_found',
        message: 'No payment methods found!',
        list: null
      };
    }

    return {
      status: 'success',
      message: 'Payment methods found',
      list: Array.isArray(paymentMethodsList)
        ? paymentMethodsList
        : [paymentMethodsList]
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message:
        'An error has occurred while fetching the payment methods. Please try again!',
      list: null
    };
  }
}

/**
 * Handles the retrieval of a payment method's data
 * @param {number } id The payment's primary key
 * @returns {Promise<{
 *      status: "rejected" | "not_found" | "success" | "error",
 *      message: string
 * }>} An object containing the payment method's data
 */
async function get (id) {
  // Validate the id
  if (id <= 0) {
    return {
      status: 'rejected',
      message: 'Provide a valid id!',
      data: null
    };
  }

  try {
    // Fetch the payment method's data
    const paymentMethod = await repo.findById(id);

    // Check if payment method exists
    if (!paymentMethod) {
      return {
        status: 'not_found',
        message: 'Payment method not found!',
        data: null
      };
    }

    return {
      status: 'success',
      message: 'Payment method found',
      data: paymentMethod
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message:
        'An error has occurred while fetching the payment method. Please try again!',
      data: null
    };
  }
}

/**
 * Handles the logic for adding a new payment method
 * @param {Object} payment The payment's data
 * @returns {Promise<{
 *     status: "rejected" | "created" | "error",
 *      message: string
 * }>} An object describing if the payment method was added or not
 */
async function add (payment) {
  // Validate the payment data
  if (!payment || Object.keys(payment).length === 0) {
    return {
      status: 'rejected',
      message: 'Provide valid payment data!'
    };
  }

  try {
    // Add the payment method
    await repo.save(payment);

    return {
      status: 'created',
      message: 'Payment method added!'
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message:
        'An error has occurred while adding the payment method. Please try again!'
    };
  }
}

/**
 * Handles the logic for updating a payment method
 * @param {number} id The payment method's primary key
 * @param {Object} newData The new payment method's data
 * @returns {Promise<{
 *     status: "rejected" | "not_found" | "success" | "error",
 *     message: string
 * }>} An object describing if the payment method was updated
 */
async function update (id, newData) {
  // Validate the arguments
  if (id <= 0) {
    return {
      status: 'rejected',
      message: 'Provide a valid id!'
    };
  }
  if (!newData || Object.keys(newData).length === 0) {
    return {
      status: 'rejected',
      message: 'Provide valid data!'
    };
  }

  try {
    // Fetch the payment method
    const oldData = await repo.findById(id);

    // Check if payment method exists
    if (!oldData) {
      return {
        status: 'not_found',
        message: 'Payment method not found!'
      };
    }

    // Update the payment method
    await repo.update(oldData, newData);

    return {
      status: 'success',
      message: 'Payment method updated!'
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message:
        'An error has occurred while updating the payment method. Please try again!'
    };
  }
}

/**
 * Handles the logic for deleting a payment method
 * @param {number} id The payment method's primary key
 * @returns {Promise<{
 *     status: "rejected" | "not_found" | "success" | "error",
 *     message: string
 * }>} An object describing if the payment is deleted
 */
async function remove (id) {
  // Validate the id
  if (id <= 0) {
    return {
      status: 'rejected',
      message: 'Provide a valid id!'
    };
  }

  try {
    // Fetch the payment method
    const paymentMethod = await repo.findById(id);

    // Check if payment method exists
    if (!paymentMethod) {
      return {
        status: 'not_found',
        message: 'Payment method not found!'
      };
    }

    // Delete the payment method
    await repo.remove(paymentMethod);

    return {
      status: 'success',
      message: 'Payment method deleted!'
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message:
        'An error has occurred while deleting the payment method. Please try again!'
    };
  }
}
module.exports = {
  getAll,
  get,
  add,
  update,
  remove
};
