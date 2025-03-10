/**
 * @module roleRepository
 * @description A repository module that directly interacts with the roles table in the database
 */
const rolesModel = require('../models/roles_model');
/**
 * Retrieves a  list of all roles in the database
 * @returns {Promise<rolesModel[] | null>} A list of roles or null
 * @throws {Error} In case of any errors
 */
async function findAll () {
  try {
    return await rolesModel.findAll();
  } catch (e) {
    throw new Error(`An error has occurred while fetching the list of roles: ${e.message}`);
  }
}

/**
 * Retrieves a role's data by name
 * @param {string} name The name of the role
 * @returns {Promise<rolesModel>} The role's data
 * @throws {Error} In case of any errors
 */
async function findByName (name) {
  try {
    return await rolesModel.findOne({ where: { name } });
  } catch (e) {
    throw new Error(`An error has occurred while fetching the role's data: ${e.message}`);
  }
}
/**
 * Retrieves a role's data by name
 * @param {number} id The role's primary key
 * @returns {Promise<rolesModel>} The role's data
 * @throws {Error} In case of any errors
 */
async function findById (id) {
  try {
    return await rolesModel.findByPk(id);
  } catch (e) {
    throw new Error(`An error has occurred while fetching the role's data: ${e.message}`);
  }
}

/**
 * Adds a new role to the database
 * @param role The role's data
 * @returns {Promise<void>} A promise that resolves when the role is added
 * @throws {Error} In case of an error
 */
async function save (role) {
  try {
    await rolesModel.create(role);
  } catch (e) {
    throw new Error(`An error has occurred while adding the role: ${e.message}`);
  }
}

/**
 * Updates an existing role's data
 * @param {rolesModel} oldData The existing data
 * @param {Object} newData The updated data
 * @returns {Promise<void>} A promise that resolves when the data is updated
 * @throws {Error} In case of any errors
 */
async function update (oldData, newData) {
  try {
    await oldData.update(newData);
  } catch (e) {
    throw new Error(`An error has occurred while updating the role: ${e.message}`);
  }
}

/**
 * Removes a role's record from the database
 * @param {rolesModel} role The role's data
 * @returns {Promise<void>} A promise that resolves when the role is deleted
 * @throws {Error} In case of an error
 */
async function remove (role) {
  try {
    await role.destroy();
  } catch (e) {
    throw new Error(`An error has occurred while removing the role: ${e.message}`);
  }
}
module.exports = { findAll, findByName, findById, save, update, remove };
