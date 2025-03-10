/**
 * @module orderedFoodRepository
 * @description A repository module that directly interacts with the ordered food table in the database
 */
const orderedFoodModel = require('../models/ordered_food_model');

/**
 * Retrieves an ordered item's data
 * @param {number} id The ordered item's primary key
 * @returns {Promise<orderedFoodModel | null>} The ordered item's data or null
 * @throws {Error} In case of an error
 */
async function findById (id) {
  try {
    return await orderedFoodModel.findOne({ where: { id } });
  } catch (e) {
    throw new Error(
      `An error has occurred while fetching the ordered item's data: ${e.message}`
    );
  }
}

/**
 * Retrieves a list of ordered items belonging to a specific order
 * @param {number} id The order's primary key
 * @returns {Promise<orderedFoodModel[] | null>} A list of ordered items or null
 * @throws {Error} In case of an error
 */
async function findByOrder (id) {
  try {
    return await orderedFoodModel.findAll({ where: { order: id } });
  } catch (e) {
    throw new Error(
      `An error has occurred while retrieving the list of food item's in an order: ${e.message}`
    );
  }
}

/**
 * Adds a new food item to an order
 * @param {orderedFoodModel} orderedFood The new ordered food data
 * @returns {Promise<void>} A promise that resolves when the food item is added to an order
 * @throws {Error} In case of any errors
 */
async function addToOrder (orderedFood) {
  try {
    await orderedFoodModel.create(orderedFood);
  } catch (e) {
    throw new Error(
      `An error has occurred while adding the ordered food: ${e.message}`
    );
  }
}

/**
 * Updates an existing ordered item's data
 * @param {orderedFoodModel} oldData
 * @param {Object} newData
 * @returns {Promise<void>} A promise that resolves when the ordered item is updated
 * @throws {Error} In case of any errors
 */
async function update (oldData, newData) {
  try {
    await oldData.update(newData);
  } catch (e) {
    throw new Error(
      `An error has occurred while updating the ordered item: ${e.message}`
    );
  }
}

/**
 * Removes an ordered item's data from an order
 * @param {orderedFoodModel} orderedItem The ordered item's data
 * @returns {Promise<void>} A promise that resolves when an ordered item is deleted
 * @throws {Error} In case of any errors
 */
async function remove (orderedItem) {
  try {
    await orderedItem.destroy();
  } catch (e) {
    throw new Error(
      `An error occurred while deleting the ordered food: ${e.message}`
    );
  }
}
module.exports = {
  findById,
  findByOrder,
  addToOrder,
  update,
  remove
};
