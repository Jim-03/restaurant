/**
 * @module orderedFoodService
 * @description A service module that handles the business logic on the ordered food model
 */
const repo = require('../repositories/orderFoodRepository');

/**
 * Handles the logic for adding a food item to an order
 * @param {Object} orderedFood The ordered food data
 * @returns {Promise<{
 *     status: "rejected" | "success" | "error",
 *     message: string
 * }>} An object confirming if the food item was added
 */
async function addToOrder (orderedFood) {
  // Validate the ordered food data

  if (!orderedFood || Object.keys(orderedFood).length === 0) {
    return {
      status: 'rejected',
      message: 'Provide the data of the food being ordered!'
    };
  }

  try {
    // Add the food item to the order
    await repo.addToOrder(orderedFood);
    return {
      status: 'success',
      message: 'The food item was successfully added'
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message:
        'An error has occurred while adding the food item to the order. Please try again!'
    };
  }
}

/**
 * Handle the logic for retrieving a list of food items in an order
 * @param {number} id The order's primary key
 * @returns {Promise<{
 *      status: "rejected" | "not_found" | "success" | "error",
 *      message: string
 *      list: [] | null
 * }>}
 */
async function getByOrder (id) {
  // Validate id
  if (id <= 0) {
    return {
      status: 'rejected',
      message: "Provide a valid order's id!",
      list: null
    };
  }

  try {
    // Fetch the list of food items in an order
    const orderedList = await repo.findByOrder(id);

    // Check if list exists or is empty
    if (!orderedList || orderedList.length === 0) {
      return {
        status: 'not_found',
        message: "The specified order doesn't have any food items!",
        list: null
      };
    }

    return {
      status: 'success',
      message: 'List found',
      list: Array.isArray(orderedList) ? orderedList : [orderedList]
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message:
        'An error has occurred while fetching the food items in the order. Please try again!',
      list: null
    };
  }
}

/**
 * Handles the logic for updating an ordered food item
 * @param {number} id The ordered food item primary key
 * @param {Object} newData The newly updated data
 * @returns {Promise<{
 *      status: "rejected" | "not_found" | "success" | "error",
 *      message: string
 * }>} An object confirming if the ordered item was updated
 */
async function updateFoodItem (id, newData) {
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
    // Fetch the ordered food data
    const oldData = await repo.findById(id);

    // Check if old data exists
    if (!oldData) {
      return {
        status: 'not_found',
        message: "Ordered item doesn't exist!"
      };
    }

    // Update the data
    await repo.update(oldData, newData);

    return {
      status: 'success',
      message: 'Ordered item was successfully updated'
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message:
        'An error has occurred while updating the order. Please try again!'
    };
  }
}

/**
 * Removes an ordered item from an order
 * @param {number} id The ordered item's primary key
 * @returns {Promise<{
 *      status: "rejected" | "not_found" | "success" | "error",
 *      message: string
 * }>} An object confirming if the ordered item was removed
 */
async function remove (id) {
  if (id <= 0) {
    return {
      status: 'rejected',
      message: 'Provide a valid id!'
    };
  }

  try {
    // Fetch the ordered food data
    const food = await repo.findById(id);

    // Check if the ordered food exists
    if (!food) {
      return {
        status: 'not_found',
        message: "The specified ordered item doesn't exist!"
      };
    }

    // Remove the item
    await repo.remove(food);
    return {
      status: 'success',
      message: 'The ordered item was successfully removed'
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message:
        'An error has occurred while removing the ordered item. Please try again!'
    };
  }
}
module.exports = {
  getByOrder,
  addToOrder,
  updateFoodItem,
  remove
};
