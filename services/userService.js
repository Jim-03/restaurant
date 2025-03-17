/**
 * @module userService
 * @description A module that handles the business logic on a user's data
 */

const repo = require('../repositories/userRepository');
const bcrypt = require('bcrypt');

/**
 * Handles the logic to retrieve a list of all users
 * @returns {Promise<{
 *     status: "not_found" | "success" | "error",
 *     message: string,
 *     list: [] | null
 * }>} An object containing the list of users or null
 */
async function getAll () {
  try {
    // Fetch all users
    const userList = await repo.findAll();

    // Check if users exist
    if (!userList || userList.length === 0) {
      return {
        status: 'not_found',
        message: 'No users at the moment!',
        list: null
      };
    }

    // Iterate the list removing passwords for security
    userList.forEach(user => {
      user.password = null;
    });

    return {
      status: 'success',
      message: 'Users list found',
      list: Array.isArray(userList) ? userList : [userList]
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while fetching the list of users. Please try again later!',
      list: null
    };
  }
}

/**
 * Handles the logic for retrieving a user's data by id
 * @param {number} id The user's primary key
 * @returns {Promise<{
 *     status: "rejected" | "not_found" | "success" | "error",
 *     message: string,
 *     data: Object | null
 * }>} An object containing the user's data
 */
async function getById (id) {
  // Check if the id is valid
  if (id <= 0) {
    return {
      status: 'rejected',
      message: 'Provide a valid id!',
      data: null
    };
  }

  try {
    // Fetch the user's data
    const user = await repo.findById(id);

    // Check if user exists
    if (!user) {
      return {
        status: 'not_found',
        message: "The specified user wasn't found!",
        data: null
      };
    }

    // Remove the user's password
    user.password = null;

    return {
      status: 'success',
      message: 'Account found',
      data: user
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: "An error has occurred while fetching the user's data. Please try again later!",
      data: null
    };
  }
}

/**
 * Handles the criteria for adding a user to the database
 * @param user The user's data
 * @returns {Promise<{
 *     status: "rejected" | "duplicate" | "created" | "error",
 *     message: string
 * }>} An object confirming whether a user was added or not
 */
async function add (user) {
  // Check if the user's data is provided
  if (!user) {
    return {
      status: 'rejected',
      message: "Provide the user's data!"
    };
  }

  try {
    // Check if user's data violate constraints
    const userExists = repo.exists();

    if (userExists) {
      return {
        status: 'duplicate',
        message: 'An account with these credentials already exists!'
      };
    }

    // Hash the user's password
    user.password = bcrypt.hash(user.password, bcrypt.genSalt(10));

    await repo.save(user);
    return {
      status: 'created',
      message: 'Account successfully created'
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while adding the user. Please try again!'
    };
  }
}

/**
 * Authenticates the user to access their account
 * @param {Object} user An object containing username and password for authorization
 * @returns {Promise<{
 *     status: "rejected" | "not_found" | "success" | "error",
 *     message: string,
 *     data: Object | null
 * }>} An object containing the user's data if they're authorized
 */
async function authenticate (user) {
  // Check individual keys
  if (!user.username) {
    return {
      status: 'rejected',
      message: 'Provide the username!',
      data: null
    };
  }

  if (!user.password) {
    return {
      status: 'rejected',
      message: 'Provide the password!',
      data: null
    };
  }

  try {
    // Fetch the user's data
    const userData = await repo.findByUsername(user.username);

    // Check if user exists
    if (!userData) {
      return {
        status: 'not_found',
        message: "The account wasn't found!",
        data: null
      };
    }

    // Validate the user's password
    if (!await bcrypt.compare(user.password, userData.password)) {
      return {
        status: 'rejected',
        message: 'Incorrect password!',
        data: null
      };
    }

    // Remove the password
    userData.password = undefined;

    return {
      status: 'success',
      message: 'Authorized',
      data: userData
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while authenticating the user. Please try again later!',
      data: null
    };
  }
}

/**
 * Handles the logic for updating the user's account
 * @param {number} id The account's primary key
 * @param {Object} newData The account's new data
 * @returns {Promise<{
 *     status: "rejected" | "not_found" | "success" | "error",
 *     message: string
 * }>} An object confirming whether the account was updated or not
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
      message: "Provide the account's new data!"
    };
  }

  try {
    // Fetch the user's data
    const oldData = await repo.findById(id);

    // Check if user exists
    if (!oldData) {
      return {
        status: 'not_found',
        message: "The specified account doesn't exist!"
      };
    }

    // Check the old password if correct
    if (newData.oldPassword && !bcrypt.compare(newData.oldPassword, oldData.password)) {
      return {
        status: 'rejected',
        message: 'Your old password is incorrect'
      };
    }

    // Hash the new password
    if (newData.password) {
      newData.password = bcrypt.hash(newData.password, bcrypt.genSalt(10));
    }

    // Update the data
    await repo.update(oldData, newData);
    return {
      status: 'success',
      message: 'Account successfully updated!'
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while updating the account. Please try again later!'
    };
  }
}

/**
 * Handles the logic for deleting a user's account
 * @param id The user's primary key
 * @returns {Promise<{
 *     status: "rejected" | "not_found" | "success" | "error",
 *     message: string
 * }>} An object confirming whether an object was deleted or not
 */
async function remove (id) {
  // Validate id
  if (id <= 0) {
    return {
      status: 'rejected',
      message: 'Provide a valid id!'
    };
  }

  try {
    // Fetch the user's data
    const user = await repo.findById(id);

    // Check if user exists
    if (!user) {
      return {
        status: 'not_found',
        message: "The specified account wasn't found!"
      };
    }

    // Delete user
    await repo.remove(user);

    return {
      status: 'success',
      message: 'Account was successfully deleted'
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while trying to delete the account. Please try again later!'
    };
  }
}
module.exports = { getAll, getById, add, authenticate, update, remove };
