/**
 * @module userRepository
 * @description A repository module that directly interacts with the users table in the database
 */

const userModel = require('../models/user_model');
const { Op } = require('sequelize');

/**
 * Retrieves a list of all users
 * @returns {Promise<userModel[] | null>} The list of users or null
 * @throws {Error} In case of any errors
 */
async function findAll () {
  try {
    return await userModel.findAll();
  } catch (e) {
    throw new Error(`An error has occurred while fetching the list of users: ${e.message}`);
  }
}

/**
 * Retrieves a user's data by their primary key
 * @param {number} id The user's primary key
 * @returns {Promise<userModel | null>} The user's data or null
 * @throws {Error} In case of any errors
 */
async function findById (id) {
  try {
    return await userModel.findByPk(id);
  } catch (e) {
    throw new Error(`AN error has occurred while fetching the user's data: ${e.message}`);
  }
}

/**
 * Retrieves a user's data by their username
 * @param {string} username The account's unique name
 * @returns {Promise<userModel | null>} The user's data or null
 * @throws {Error} In case of any errors
 */
async function findByUsername (username) {
  try {
    return await userModel.findOne({ where: { username } });
  } catch (e) {
    throw new Error(`An error has occurred while fetching the user's data: ${e.message}`);
  }
}
/**
 * Checks if a user exists in the database using the email, phone or username
 * @param {Object} user The user's data
 * @returns {Promise<boolean>} True if the user exists, false otherwise
 * @throws {Error} In case of any errors
 */
async function exists (user) {
  if (!user) {
    return false;
  }

  try {
    return !!(await userModel.findOne({
      where: {
        username: user.username,
        [Op.or]: {
          phone: user.phone,
          email: user.email
        }
      }
    }));
  } catch (e) {
    throw new Error(`An error has occurred when confirming user's credentials: ${e.message}`);
  }
}

/**
 * Adds a new user to the database
 * @param user The user's data
 * @returns {Promise<void>} A promise that resolves only when the user is added
 * @throws {Error} In case of any errors
 */
async function save (user) {
  try {
    await userModel.create(user);
  } catch (e) {
    throw new Error(`An error has occurred while saving the user: ${e.message}`);
  }
}

/**
 * Updates an existing account's data
 * @param {userModel} oldData
 * @param {Object}newData
 * @returns {Promise<void>} A promise that resolves when the account is updated
 */
async function update (oldData, newData) {
  try {
    await oldData.update(newData);
  } catch (e) {
    throw new Error(`An error has occurred while updating the account: ${e.message}`);
  }
}

/**
 * Deletes an existing user's data
 * @param user The user's data
 * @returns {Promise<void>} A promise that resolves only when the user is deleted
 * @throws {Error} In case of an error
 */
async function remove (user) {
  try {
    await user.destroy();
  } catch (e) {
    throw new Error(`An error has occurred while deleting the account: ${e.message}`);
  }
}

module.exports = {
  findAll,
  findById,
  exists,
  save,
  findByUsername,
  update,
  remove
};
