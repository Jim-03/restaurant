/**
 * @module foodRepository
 * @description This module provides functions that directly interact with the database
 */

const foodItem = require('../models/food_model');
const { Op } = require('sequelize');

/**
 * Retrieves a food item's data by its name
 * @param {string} name The name of the food item
 * @returns {Promise<foodItem | null>} The food item's data or null
 * @throws {Error} In case of any error
 */
async function findByName (name) {
  try {
    return await foodItem.findOne({
      where: {
        name
      }
    });
  } catch (error) {
    throw new Error(`Failed to get the food item: ${error.message}`);
  }
}

/**
 * Retrieves a list of food items having a similar substring in their name
 * @param {string} name The substring to search for
 * @returns {Promise<foodItem[] | null>} A list of food item's or null
 * @throws {Error} In case of any errors
 */
async function findAllByName (name) {
  try {
    return await foodItem.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`
        }
      }
    });
  } catch (e) {
    throw new Error(`An error has occurred while fetching the food list: ${e.message}`);
  }
}

/**
 * Retrieves a food item's data by its primary key
 * @param {number} id The primary key
 * @returns {Promise<foodItem | null>} The food item's data or null
 * @throws {Error} In case of any error
 */
async function findById (id) {
  try {
    return await foodItem.findByPk(id);
  } catch (e) {
    throw new Error(`An error has occurred while fetching the food item ${e.message}`);
  }
}

/**
 * Adds a new food item to the database
 * @param {Object} food The food object
 * @throws {Error} In case of any errors
 */
async function save (food) {
  try {
    await foodItem.create(food);
  } catch (error) {
    throw new Error(`An error has occurred while adding the food item: ${error.message}`);
  }
}

/**
 * Retrieves a list of food items belonging in the same category
 * @param {number} id The category's primary key
 * @returns {Promise<foodItem[] | null>} The list of food items or null
 * @throws {Error} In case of any errors
 */
async function findByCategory (id) {
  try {
    return await foodItem.findAll({ where: { category: id } });
  } catch (e) {
    throw new Error(`An error has occurred while fetching the category's food list: ${e.message}`);
  }
}

/**
 * Updates an existing food item
 * @param {Object} oldData The food item's old data
 * @param {Object} newData The data to be updated to
 * @throws {Error} In case of any error
 */
async function update (oldData, newData) {
  try {
    await oldData.update(newData);
  } catch (e) {
    throw new Error(`An error has occurred while updating the food item: ${e.message}`);
  }
}

/**
 * Deletes an existing food item's data from the database
 * @param {Object} food The food item's data
 * @throws {Error} In case of an error
 */
async function remove (food) {
  try {
    await food.destroy();
  } catch (e) {
    throw new Error(`An error occurred while deleting the food item: ${e.message}`);
  }
}
module.exports = { findByName, save, findAllByName, findByCategory, update, findById, remove };
