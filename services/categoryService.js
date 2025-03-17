/**
 * @module categoryService
 * @description The business logic for the category model
 */
const repo = require('../repositories/categoryRepository');

/**
 * Handles the logic for adding a new category record
 * @param {Object} category The new category's data
 * @returns {Promise<{
 *      status: "rejected" | "duplicate" | "created" | "error",
 *      message: string}>} An object confirming if the category was successfully added
 */
async function addCategory (category) {
  // Check if category's data is present
  if (!category || Object.keys(category).length === 0) {
    return {
      status: 'rejected',
      message: "Provide the category's data!"
    };
  }

  try {
    // Check if another category exists
    if (await repo.findByName(category.name)) {
      return {
        status: 'duplicate',
        message: 'Category already exists!'
      };
    }

    // Add the new category
    await repo.save(category);
    return {
      status: 'created',
      message: 'Category successfully added'
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while saving the category. Please try again later!'
    };
  }
}

/**
 * Handles the logic for retrieving a list of all categories
 * @returns {Promise<{
 *     status: "not_found" | "success" | "error",
 *     message: string,
 *     list: [] | null
 * }>} An object containing the list of categories
 */
async function getAll () {
  try {
    // Fetch a list of all categories
    const categoryList = await repo.findAll();

    // Check if categories exist
    if (!categoryList || categoryList.length === 0) {
      return {
        status: 'not_found',
        message: 'No categories found!',
        list: null
      };
    }

    return {
      status: 'success',
      message: 'Category list found',
      list: Array.isArray(categoryList) ? categoryList : [categoryList]
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while fetching the category list. Please try again later!',
      list: null
    };
  }
}

/**
 * Handles the logic for updating a category
 * @param {number} id The category's primary key
 * @param {Object} newData The data to update to
 * @returns {Promise<{
 *      status: "rejected" | "not_found" | "success" | "error",
 *      message: string}>} An object confirming if the category was updated or not
 */
async function updateCategory (id, newData) {
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
      message: 'Provide the data to update to!'
    };
  }

  try {
    // Fetch the old data
    const oldData = await repo.findById(id);

    // Check if old data exists
    if (!oldData) {
      return {
        status: 'not_found',
        message: "The specified category doesn't exist!"
      };
    }

    // Update the data
    await repo.update(oldData, newData);
    return {
      status: 'success',
      message: 'Category successfully updated'
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      message: 'An error has occurred while updating the category. Please try again later!'
    };
  }
}

/**
 * Handles the logic for deleting a category
 * @param {number} id THe category's primary key
 * @returns {Promise<{
 *      status: "rejected" | "not_found" | "success" | "error",
 *      message: string}>} An object confirming if the category was deleted
 */
async function deleteCategory (id) {
  // Validate the id
  if (id <= 0) {
    return {
      status: 'rejected',
      message: 'Provide a valid id!'
    };
  }

  try {
    // Fetch the category's data
    const category = await repo.findById(id);

    // Check if category exists
    if (!category) {
      return {
        status: 'not_found',
        message: "The specified category wasn't found!"
      };
    }

    // Delete the category
    await repo.remove(category);
    return {
      status: 'success',
      message: 'Category successfully removed'
    };
  } catch (e) {
    console.error(e);
    return { status: 'error', message: 'An error has occurred while deleting the category. Please try again later!' };
  }
}

module.exports = {
  addCategory,
  getAll,
  updateCategory,
  deleteCategory
};
