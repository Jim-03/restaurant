/**
 * @module roleService
 * @description A service module that handles the business logic on the role model
 */

const repo = require('../repositories/roleRepository');

/**
 * Handles the logic for retrieving a list of all roles
 * @returns {Promise<{
 *     status: "not_found" | "success" | "error",
 *     message: string,
 *     list: [] | null
 * }>} An object containing the list of roles
 */
async function getAll () {
  try {
    // Fetch a list of all roles
    const rolesList = await repo.findAll();

    // Check if any roles exist
    if (!rolesList || rolesList.length === 0) {
      return {
        status: 'not_found',
        message: 'No roles exist at the moment!',
        list: null
      };
    }

    return {
      status: 'success',
      message: 'Roles found',
      list: Array.isArray(rolesList) ? rolesList : [rolesList]
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while fetching the roles list. Please try again!',
      list: null
    };
  }
}

/**
 * Handles the logic for fetching a role's data
 * @param {number} id The role's primary key
 * @returns {Promise<{
 *     status: "rejected" | "not_found" | "success"  | "error",
 *     message: string,
 *     data: Object | null
 * }>} An object containing the role's data
 */
async function get (id) {
  // Validate id
  if (id <= 0) {
    return {
      status: 'rejected',
      message: 'Provide a valid id!',
      data: null
    };
  }

  try {
    // Fetch the role's data
    const role = await repo.findById(id);

    // Check if role exists
    if (!role) {
      return {
        status: 'not_found',
        message: "The specified role wasn't found!",
        data: null
      };
    }

    return {
      status: 'success',
      message: 'Role was found',
      data: role
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: "An error has occurred while fetching the role's data. Please try again!",
      data: null
    };
  }
}
/**
 * Handles the logic for adding a role to the database
 * @param {Object} role The role's data
 * @returns {Promise<{
 *     status: "rejected" | "duplicate" | "created" | "error",
 *     message: string
 * }>} An object confirming if the role was added
 */
async function add (role) {
  // Check if the role's data is provided
  if (!role || Object.keys(role).length === 0) {
    return {
      status: 'rejected',
      message: "Provide the role's data!"
    };
  }

  try {
    // Check if role violates unique constraint
    if (await repo.findByName(role.name)) {
      return {
        status: 'duplicate',
        message: 'Role already exists!'
      };
    }

    // Add the new role
    await repo.save(role);

    return {
      status: 'created',
      message: 'Role successfully added'
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while adding the role. Please try again later!'
    };
  }
}

/**
 * Handles the logic for updating a role in the system
 * @param {number} id The role's primary key
 * @param {Object} newData The role's updated data
 * @returns {Promise<{
 *     status: "rejected" | "not_found" | "success" | "error",
 *     message: string
 * }>} An object confirming if a role was updated
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

    // Check if role exists
    if (!oldData) {
      return {
        status: 'not_found',
        message: "The specified role wasn't found!"
      };
    }

    // Check if new data violates unique constraint
    if (newData.name && await repo.findByName(newData.name)) {
      return {
        status: 'duplicate',
        message: 'Another role with this name exists!'
      };
    }

    // Update the role
    await repo.update(oldData, newData);

    return {
      status: 'success',
      message: 'Role successfully updated'
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while updating the role. Please try again!'
    };
  }
}

/**
 * Handles the logic of removing a role in the system
 * @param {number} id The role's primary key
 * @returns {Promise<{
 *     status: "rejected" | "not_found" | "success" | "error",
 *     message: string
 * }>} An object that describes if the role was deleted
 */
async function remove (id) {
  //  Validate the id
  if (id <= 0) {
    return {
      status: 'rejected',
      message: 'Provide a valid id!'
    };
  }

  try {
    // Fetch the role's data
    const role = await repo.findById(id);

    // Check if role exists
    if (!role) {
      return {
        status: 'not_found',
        message: "The role wasn't found!"
      };
    }

    // Delete the role
    await repo.remove(role);

    return {
      status: 'success',
      message: 'Role successfully removed'
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while deleting the role. Please try again!'
    };
  }
}
module.exports = { getAll, add, get, update, remove };
