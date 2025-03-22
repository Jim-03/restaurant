/**
 * @module orderService
 * @description A service module that handles the business logic on the order model
 */

const repo = require('../repositories/orderRepository');

/**
 * Handles the logic of fetching an order's data
 * @param {number} id The order's primary key
 * @returns {Promise<{
 *     status: "rejected" | "not_found" | "success" | "error",
 *     message: string,
 *     data: null
 * }>} An object containing the order's data
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
    // Fetch the order
    const order = await repo.findById(id);

    // Check if order exists
    if (!order) {
      return {
        status: 'not_found',
        message: "The specified order wasn't found!",
        data: null
      };
    }

    return {
      status: 'success',
      message: 'Order was found',
      data: order
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while fetching the order. Please try again!',
      data: null
    };
  }
}

/**
 * Handles the logic for retrieving a list of incomplete orders
 * @returns {Promise<{
 *     status: "not_found" | "success" | "error",
 *     message: string,
 *     list: [] | null
 * }>} An object containing the list of incomplete orders or null
 */
async function getIncompleteOrders () {
  try {
    // Fetch the list of unfinished orders
    const incompleteList = await repo.findByIncomplete();

    // Check if the list exists or is empty
    if (!incompleteList || incompleteList.length === 0) {
      return {
        status: 'not_found',
        message: "No incomplete order's at the moment!",
        list: null
      };
    }

    return {
      status: 'success',
      message: 'List found',
      list: Array.isArray(incompleteList) ? incompleteList : [incompleteList]
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while fetching the incomplete orders. Please try again!',
      list: null
    };
  }
}

/**
 * Handles the logic for retrieving a list of orders made by a waiter/waitress
 * @param id The waiter's/waitress' primary key
 * @returns {Promise<{
 *     status: "rejected" | "not_found" | "success" | "error",
 *     message: string,
 *     list: null
 * }>} An object with the orders list or null
 */
async function getByServer (id) {
// Validate the id
  if (id <= 0) {
    return {
      status: 'rejected',
      message: 'Provide a valid id!',
      list: null
    };
  }

  try {
    // Fetch the orders handled by the server
    const ordersHandledByServer = await repo.findByServer(id);

    // Check if orders exist or is empty
    if (!ordersHandledByServer || ordersHandledByServer.length === 0) {
      return {
        status: 'not_found',
        message: "The server hasn't served any orders!",
        list: null
      };
    }
    // TODO: Pagination and sorting by date or month or year
    return {
      status: 'success',
      message: 'Orders found',
      list: Array.isArray(ordersHandledByServer) ? ordersHandledByServer : [ordersHandledByServer]
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while fetching the list of orders made by the server. Please try again!',
      list: null
    };
  }
}

/**
 * Handles the logic for retrieving orders made in a specific month of the current year
 * @param {number} month The month number ranging from 0-11
 * @returns {Promise<{
 *     status: "rejected" | "not_found" | "success" | "error",
 *     message: string,
 *     list: null | []
 * }>} An object with the orders list or null
 */
async function getByMonth (month) {
  // Validate the month number
  if (month < 0 || month > 11) {
    return {
      status: 'rejected',
      message: 'Provide a valid month number (0-11)!',
      list: null
    };
  }

  const now = new Date();
  const year = now.getFullYear();
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

  try {
    // Fetch orders within the month range
    const ordersInMonth = await repo.findByDateRange(startOfMonth, endOfMonth);

    // Check if orders exist
    if (!ordersInMonth || ordersInMonth.length === 0) {
      return {
        status: 'not_found',
        message: 'No orders found for the specified month!',
        list: null
      };
    }

    return {
      status: 'success',
      message: 'Orders found',
      list: Array.isArray(ordersInMonth) ? ordersInMonth : [ordersInMonth]
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while fetching orders for the specified month. Please try again!',
      list: null
    };
  }
}

/**
 * Handles the logic for retrieving the orders made in a certain year
 * @param {number} year
 * @returns {Promise<{
 *     status: "rejected" | "not_found" | "success" | "error",
 *     message: string,
 *     list: null | []
 * }>} An object with the orders list or null
 */
async function getByYear (year) {
  // Validate the year
  if (!Number.isInteger(year) || year < 1000 || year > new Date().getFullYear()) {
    return {
      status: 'rejected',
      message: 'Provide a valid year!',
      list: null
    };
  }

  try {
    const start = new Date(year, 0, 1, 0, 0, 0);
    const end = new Date(year, 11, 31, 23, 59, 59);

    // Fetch the list of orders
    const ordersInYear = await findByDateRange(start, end);

    // Check if orders exist
    if (!ordersInYear || ordersInYear.length === 0) {
      return {
        status: 'not_found',
        message: 'No orders found for the specified year!',
        list: null
      };
    }

    return {
      status: 'success',
      message: 'Orders found',
      list: Array.isArray(ordersInYear) ? ordersInYear : [ordersInYear]
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while fetching orders for the specified year. Please try again!',
      list: null
    };
  }
}

/**
 * Handles the logic for adding a new order to the system
 * @param {Object} order The order's data
 * @returns {Promise<{
 *     status: "rejected" | "created" | "error",
 *     message: string,
 *     id: Number
 * }>} An object confirming if an order is added
 */
async function add (order) {
  // Validate the order's data
  if (!order || Object.keys(order).length === 0) {
    return {
      status: 'rejected',
      message: 'Provide valid order data!',
      id: null
    };
  }

  try {
    // Add the order to the database
    const data = await repo.save(order);
    return {
      status: 'created',
      message: 'Order was successfully made. Kindly wait for a response',
      id: data.id
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while making the order. Please try again!',
      id: null
    };
  }
}

/**
 * Handles the logic for updating an existing order
 * @param {number} id The order's primary key
 * @param {Object} newData
 * @returns {Promise<{
 *     status: "rejected" | "not_found" | "success" | "error",
 *     message: string
 * }>} An object describing whether an object was updated or not
 */
async function update (id, newData) {
  // Validate arguments
  if (id <= 0) {
    return {
      status: 'rejected',
      message: 'Provide a valid id!'
    };
  }

  if (!newData || Object.keys(newData).length === 0) {
    return {
      status: 'rejected',
      message: 'Provide the updated data!'
    };
  }

  try {
    // Fetch the old data
    const oldData = await repo.findById(id);

    // Check if old data exists
    if (!oldData) {
      return {
        status: 'not_found',
        message: "The specified order doesn't exist!"
      };
    }

    // Update the data
    await repo.update(oldData, newData);
    return {
      status: 'success',
      message: 'Order successfully updated'
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while updating the order. Please try again!'
    };
  }
}

/**
 * Handles the logic for removing an order from the system
 * @param {number} id The order's primary key
 * @returns {Promise<{
 *     status: "rejected" | "not_found" | "success" | "error",
 *     message: string
 * }>} An object describing if the order was successfully removed
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
    // Fetch the order's data
    const order = await repo.findById(id);

    // Check if order exists
    if (!order) {
      return {
        status: 'not_found',
        message: "The specified order doesn't exist!"
      };
    }

    // Delete the order
    await repo.remove(order);

    return {
      status: 'success',
      message: 'Order successfully deleted'
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while deleting the order. Please try again!'
    };
  }
}
module.exports = { get, getIncompleteOrders, getByServer, getByMonth, getByYear, add, update, remove };
