/**
 * @module paymentService
 * @description Handles the business logic for the payment model
 */

const repo = require('../repositories/paymentRepository');

/**
 * Handles the logic for adding the payment to the system
 * @param {Object} payment The payment's list
 * @returns {Promise<{
 *      status: "rejected" | "created" | "error",
 *      message: string,
 *      id: Number
 * }>} An object that describes if the payment was added successfully or not
 */
async function add (payment) {
  // Confirm if payment list is provided
  if (!payment || Object.keys(payment).length === 0) {
    return {
      status: 'rejected',
      message: 'Provide valid payment details!',
      id: 0
    };
  }

  try {
    // Add the payment details
    const paymentRecord = await repo.save(payment);
    return {
      status: 'created',
      message: 'Payment successful',
      id: paymentRecord.id
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message:
        'An error has occurred while adding the payment. Please try again!',
      id: 0
    };
  }
}

/**
 * Handles the logic for getting the payments for a specific month
 * @param {number} month The month to get the payments for
 * @returns {Promise<{
 *      status: "rejected" | "not_found" | "success" | "error",
 *      message: string,
 *      list: [] | null
 * }>} An object that describes if the payment was added successfully or not
 */
async function getByMonth (month) {
  // Validate the month
  if (!Number.isInteger(month) || month < 0 || month > 11) {
    return {
      status: 'rejected',
      message: 'Provide a valid month!',
      list: null
    };
  }

  try {
    const start = new Date(new Date().getFullYear(), month, 1);
    const end = new Date(new Date().getFullYear(), month + 1, 0, 23, 59, 59);
    // Get the payments for the month
    const paymentsList = await repo.findByDateRange(start, end);

    // Check if there are payments for the month
    if (!paymentsList.length) {
      return {
        status: 'not_found',
        message: 'No payments found for the month!',
        list: null
      };
    }
    return {
      status: 'success',
      message: 'Payments retrieved successfully',
      list: Array.isArray(paymentsList) ? paymentsList : [paymentsList]
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message:
        'An error occurred while retrieving the payments. Please try again!',
      list: null
    };
  }
}

/**
 * Handles the logic for getting the payments for a specific year
 * @param {number} year The year to get the payments for
 * @returns {Promise<{
 *      status: "rejected" | "not_found" | "success" | "error",
 *      message: string,
 *      list: [] | null
 * }>} An object that describes if the payment was added successfully
 */
async function getByYear (year) {
  // Validate the year
  if (
    !Number.isInteger(year) ||
    year < 1000 ||
    year > new Date().getFullYear()
  ) {
    return {
      status: 'rejected',
      message: 'Provide a valid year!',
      list: null
    };
  }

  try {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);

    // Fetch the payments for the year
    const paymentsList = await repo.findByDateRange(start, end);
    // Check if there are payments for the year
    if (!paymentsList.length) {
      return {
        status: 'not_found',
        message: 'No payments found for the year!',
        list: null
      };
    }
    return {
      status: 'success',
      message: 'Payments retrieved successfully',
      list: Array.isArray(paymentsList) ? paymentsList : [paymentsList]
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message:
        'An error occurred while retrieving the payments. Please try again!',
      list: null
    };
  }
}

/**
 * Handles the logic for getting a payment's details
 * @param {number} id The payment's primary key
 * @returns {Promise<{
 *      status: "rejected" | "not_found" | "success" | "error",
 *      message: string,
 *      payment: Object | null
 * }>} An object that describes if the payment was added successfully
 */
async function get (id) {
  // Validate the id
  if (id <= 0) {
    return {
      status: 'rejected',
      message: 'Provide a valid id!',
      payment: null
    };
  }

  try {
    // Get the payment by id
    const payment = await repo.findById(id);

    // Check if there are payments for the year
    if (!payment) {
      return {
        status: 'not_found',
        message: 'Payment not found!',
        payment: null
      };
    }
    return {
      status: 'success',
      message: 'Payment retrieved successfully',
      payment
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message:
        'An error occurred while retrieving the payment. Please try again!',
      payment: null
    };
  }
}

/**
 * Handles the logic for updating a payment
 * @param {number} id The payment's primary key
 * @param {Object} newData The new payment details
 * @returns {Promise<{
 *      status: "rejected" | "not_found" | "success" | "error",
 *      message: string
 * }>} An object that describes if the payment was updated successfully
 */
async function update (id, newData) {
  // Validate the arguments
  if (id >= 0) {
    return {
      status: 'rejected',
      message: 'Provide a valid id!'
    };
  }
  if (!newData || !Object.keys(newData).length === 0) {
    return {
      status: 'rejected',
      message: 'Provide valid payment details!'
    };
  }

  try {
    // Fetch the payment details
    const oldData = await repo.findById(id);

    // Check if the payment exists
    if (!oldData) {
      return {
        status: 'not_found',
        message: 'Payment not found!'
      };
    }
    // Update the payment details
    await repo.update(oldData, newData);
    return {
      status: 'success',
      message: 'Payment updated successfully'
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message:
        'An error occurred while updating the payment. Please try again!'
    };
  }
}

/**
 * Handles the logic for deleting a payment
 * @param {number} id The payment's primary key
 * @returns {Promise<{
 *      status: "rejected" | "not_found" | "success" | "error",
 *      message: string
 * }>} An object that describes if the payment was deleted successfully
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
    // fetch the payment details
    const payment = await repo.findById(id);

    // Check if the payment exists
    if (!payment) {
      return {
        status: 'not_found',
        message: 'Payment not found!'
      };
    }
    // Delete the payment
    await repo.remove(payment);
    return {
      status: 'success',
      message: 'Payment deleted successfully'
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message:
        'An error occurred while deleting the payment. Please try again!'
    };
  }
}
module.exports = {
  add,
  getByMonth,
  getByYear,
  get,
  update,
  remove
};
