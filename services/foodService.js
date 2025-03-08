/**
 * @module foodService
 * @description A food service module that handles the business logic on the food model
 */
const { findByName, save, findAllByName, findByCategory, update, findById, remove } = require('../repositories/foodRepository');

/**
 * Handles the business logic while adding a food item to the database
 * @param {Object} food The new food item's data
 * @returns {Promise<{status: string, message: string}>} An object describing whether the food item was added or not
 */
async function addFood (food) {
  // Check if food data is provided
  if (!food || Object.keys(food).length === 0) {
    return {
      status: 'rejected',
      message: "Provide the food's data!"
    };
  }

  try {
    // Check if a food item with a similar name exists
    if ((await findByName(food.name)) != null) {
      return {
        status: 'duplicate',
        message: 'A food item with this name exists!'
      };
    }

    // Add the food item
    await save(food);
    return {
      status: 'created',
      message: 'The food item was successfully added'
    };
  } catch (error) {
    console.error(error);
    return {
      status: 'error',
      message: 'An error has occurred in our end. Please try again later!'
    };
  }
}

/**
 * Handles the business logic for fetching a food item using the food item's name
 * @param {string} name The name of the food item
 * @returns {Promise<{
 *     status: "rejected" | "not_found" | "success" | "error",
 *     message: string,
 *     data: [] | null
 * }>} An object containing the food list
 */
async function getFoodItemByName (name) {
  // Check if name is provided
  if (!name) {
    return {
      status: 'rejected',
      message: "Provide the food's name!",
      data: null
    };
  }

  try {
    // Fetch the food item's data
    const food = await findByName(name);

    // Check if food item exists
    if (!food) {
      return {
        status: 'not_found',
        message: "The food item wasn't found!",
        data: null
      };
    }

    return {
      status: 'success',
      message: 'Food item found',
      data: food
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred on our end. Please try again later!',
      data: null
    };
  }
}

/**
 * Handles the business logic for retrieving a list of food items with a similar substring
 * @param {string} name The substring to search for
 * @returns {Promise<{
 *     status: "rejected" | "not_found" | "success" | "error",
 *     message: string,
 *     data: [] | null
 * }>} An object containing the food list
 */
async function getFoodList (name) {
  // Check if name is provided
  if (!name) {
    return {
      status: 'rejected',
      message: 'Provide the name to search!',
      list: null
    };
  }

  try {
    // Fetch the list of food items
    const foodList = await findAllByName(name);

    // Check if the list is empty
    if (!foodList || (foodList).length === 0) {
      return {
        status: 'not_found',
        message: 'No food item was found!',
        list: null
      };
    }

    return {
      status: 'success',
      message: 'Food list found',
      list: Array.isArray(foodList) ? foodList : [foodList]
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while fetching the list. Please try again later',
      list: null
    };
  }
}

/**
 * Handles business logic for retrieving a list of food items in the same category
 * @param {number} id The category's primary key
 * @returns {Promise<{
 *     status: "rejected" | "not_found" | "success" | "error",
 *     message: string,
 *     data: [] | null
 * }>} An object containing the food list
 */
async function getByCategory (id) {
  // Validate the id
  if (id <= 0) {
    return {
      status: 'rejected',
      message: 'Provide a valid id!',
      list: null
    };
  }

  try {
    // Fetch the food list
    const foodList = await findByCategory(id);

    // Check if the category has food items
    if (!foodList || (foodList).length === 0) {
      return {
        status: 'not_found',
        message: "The category doesn't have any food items yet!",
        list: null
      };
    }

    return {
      status: 'success',
      message: "Category's food list was found",
      list: Array.isArray(foodList) ? foodList : [foodList]
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: "An error has occurred while fetching the category's food list. Please try again later!",
      list: null
    };
  }
}

/**
 * Handles the business logic for updating a food item
 * @param id The food item's primary key
 * @param newData The updated data
 * @returns {Promise<{
 *  status: "rejected" | "not_found" | "success" | "error",
 *  message: string}>} An object describing whether the food item was updated or not
 */
async function updateItem (id, newData) {
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
    const oldData = await findById(id);

    // Check if the old data exists
    if (!oldData) {
      return {
        status: 'not_found',
        message: "The specified food item doesn't exist!"
      };
    }
    // Update the existing item
    await update(oldData, newData);

    return {
      status: 'success',
      message: 'Food item successfully updated'
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while updating the food item. Please try again later!'
    };
  }
}

/**
 * Handles the business logic for deleting a food item
 * @param {number} id The food item's primary key
 * @returns {Promise<{
 *     status: "rejected" | "not_found" | "success" | "error",
 *     message: string
 * }>} An object describing if the food item was deleted
 */
async function deleteFood (id) {
  // Validate the id
  if (id <= 0) {
    return {
      status: 'rejected',
      message: 'Provide a valid id!'
    };
  }

  try {
    // Fetch the food item
    const food = await findById(id);

    // Check if food item exists
    if (!food) {
      return {
        status: 'not_found',
        message: "The specified food item wasn't found!"
      };
    }

    // Delete the item
    await remove(food);
    return {
      status: 'success',
      message: 'Food item was successfully deleted'
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while deleting the food item. Please try again later!'
    };
  }
}

module.exports = {
  addFood,
  getFoodList,
  getByCategory,
  getFoodItemByName,
  updateItem,
  deleteFood
};
