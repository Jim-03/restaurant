const categoryModel = require('../models/category_model');

/**
 * Retrieves a category's data by name
 * @param {string} name The name of the category
 * @returns {Promise<categoryModel | null>} The category's data or null
 * @throws {Error} In case of any errors
 */
async function findByName (name) {
  try {
    return await categoryModel.findOne({ where: { name } });
  } catch (e) {
    throw new Error(`An error has occurred while fetching the category's data: ${e.message}`);
  }
}

/**
 * Creates a new category record in the database
 * @param {Object} category The category's data
 * @throws {Error} In case of any errors
 */
async function save (category) {
  try {
    await categoryModel.create(category);
  } catch (e) {
    throw new Error(`An error has occurred while adding the category to the database: ${e.message}`);
  }
}

/**
 * Retrieves a list of all categories
 * @returns {Promise<categoryModel[] | null>}
 * @throws {Error} In case of an error
 */
async function findAll () {
  try {
    return await categoryModel.findAll();
  } catch (e) {
    throw new Error(`An error has occurred while fetching the category's list: ${e.message}`);
  }
}

/**
 * Retrieves a category's data by its primary key
 * @param {number} id The primary key
 * @returns {Promise<categoryModel | null>} The category's data or null
 * @throws {Error} In case of any errors
 */
async function findById (id) {
  try {
    return await categoryModel.findByPk(id);
  } catch (e) {
    throw new Error(`An error has occurred while fetching the category's data: ${e.message}`);
  }
}

/**
 * Updates an existing category's data
 * @param oldData
 * @param newData
 * @throws {Error} In case of any errors
 */
async function update (oldData, newData) {
  try {
    await oldData.update(newData);
  } catch (e) {
    throw new Error(`An error has occurred while updating the category: ${e.message}`);
  }
}

/**
 * Removes a category's record from the database
 * @param {categoryModel} category The category model
 * @throws {Error} In case of any errors
 */
async function remove (category) {
  try {
    await category.destroy();
  } catch (e) {
    throw new Error(`An error has occurred while deleting the category: ${e.message}`);
  }
}
module.exports = { findByName, save, findAll, findById, update, remove };
