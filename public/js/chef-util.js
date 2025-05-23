import { notify } from './util.js';

/**
 * Removes all the forms and their backgrounds from the display
 */
export function close () {
  document.getElementById('foodForm').style.display = 'none';
  document.getElementById('updateForm').style.display = 'none';
  document.getElementById('deleteFoodBackground').style.display = 'none';
  document.getElementById('categoryForm').style.display = 'none';
  document.getElementById('updateCategoryForm').style.display = 'none';
  document.getElementById('deleteCategoryForm').style.display = 'none';
}

/**
 * Retrieves a list of categories from the backend
 * @returns {Array | null} The list of categories or null
 */
export async function fetchCategoryList () {
  try {
    // Get the response from the backend
    const response = await fetch('/api/category');
    const data = await response.json();

    // Check if any categories are in the system
    if (!data.list) {
      alert('There are no categories at the moment, add one first!');
      return null;
    }
    // Check if the response is okay
    if (data.status !== 'success') {
      notify(data.status, data.message);
      return null;
    }
    return data.list;
  } catch (error) {
    alert(
      'An issue has occurred while fetching the list of categories. Please try again!'
    );
    console.error(error);
    return null;
  }
}

/**
 * Displays an option of categories on the select tag
 * @param {Array} categories The list of categories
 */
export function showCategoryOptions (categories) {
  document.querySelectorAll('select').forEach((select) => {
    // Iterate through each category and add it to the options
    categories.forEach((category) => {
      // Create a new option
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;

      // Add it to the select container
      select.appendChild(option);
    });
  });
}

/**
 * Extracts the food data from the UI and sends it to the backend to be added to the database
 * @returns {undefined} Stops the code from proceeding
 */
export async function addFood () {
  // Get the food's data
  const name = document.getElementById('newFoodName').value.trim();
  const category = document.getElementById('newFoodCategory').value;
  const price = Number(document.getElementById('newFoodPrice').value);
  const stock = Number(document.getElementById('newFoodQuantity').value);

  // Validate the data
  if (!name) {
    notify('rejected', "Provide the new food's name!");
    return;
  }

  if (!category) {
    notify('rejected', "Enter the food's category!");
    return;
  }
  if (!price) {
    notify('rejected', "Provide the new food's price!");
    return;
  }
  if (!stock) {
    notify('rejected', "Provide the new food's quantity!");
    return;
  }

  try {
    // Send the food's data to the backend
    const response = await fetch('api/food', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, category, price, stock })
    });

    const result = await response.json();

    // Notify the chef
    notify(result.status, result.message);

    // Remove the form from the display if the response is okay
    if (result.status === 'created') {
      // Clear the form
      clearForm();
      close();
    }
  } catch (error) {
    alert('An error has occurred. Please try again!');
    console.error(error);
  }
}

export function clearForm () {
  // Iterate through each input and clear them
  document.querySelectorAll('input').forEach((input) => {
    input.value = '';
  });

  // Iterate through each select option and clear
  document.querySelectorAll('select').forEach((select) => {
    select.value = '';
  });

  // Iterate through each text area and clear its value
  document.querySelectorAll('textarea').forEach(textArea => {
    textArea.value = '';
  });
}

/**
 * Searches for food item's in the backend database
 * @param {string} name The food's name
 * @returns {Object | null} The food's data' or null
 */
export async function searchFoodItems (name) {
  // Check if name is provided
  if (!name) return null;
  try {
    // Fetch the food items
    const response = await fetch(`/api/food/${name}`);
    const data = await response.json();

    // Check if the response is okay
    if (data.status !== 'success') {
      notify(data.status, data.message);
      return null;
    }

    // Return the list
    return data.data;
  } catch (error) {
    alert(
      'An error has occurred while searching for the food item.\n Please try again!'
    );
    console.error(error);
    return null;
  }
}

export async function updateFood () {
  // Fetch the food's new details
  const productNumber = document.getElementById('updateProductNumber').value;
  const newName = document.getElementById('updatedFoodName').value;
  const newPrice = document.getElementById('updatedFoodPrice').value;
  const newCategory = document.getElementById('updatedFoodCategory').value;
  const newStock = document.getElementById('updatedFoodStock').value;

  try {
    // Send the updated data to the backend
    const response = await fetch(`/api/food/${productNumber}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newName,
        price: newPrice,
        category: newCategory,
        stock: newStock
      })
    });

    const data = await response.json();

    // Notify the chef
    notify(data.status, data.message);

    // Clear the form and display if it was successful
    if (data.status === 'success') {
      clearForm();
      close();
    }
  } catch (error) {
    alert('An error has occurred. Please try again!');
    console.log(error);
  }
}

export async function deleteFood (id) {
  // Confirm if the food data is to be deleted
  if (!confirm('Are you sure you want to delete the food item?')) return;

  try {
    // Send a delete request
    const response = await fetch(`/api/food/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    // Notify the chef
    notify(data.status, data.message);

    // Close the form
    if (data.status === 'success') {
      clearForm();
      // Get the delete food data container
      const deleteFoodData = document.getElementById('deleteFoodData');

      // Clear previous results
      deleteFoodData.innerHTML = '<p>Search food Item</p>';
      close();
    }
  } catch (error) {
    alert('An error has occurred. Please try again!');
    console.error(error);
  }
}

/**
 * Retrieves details from the category UI and sends to the backend to add it to the database
 * @returns {undefined} Stops the code from complete execution
 */
export async function addCategory () {
  const name = document.getElementById('newCategoryName').value.trim();
  const description = document.getElementById('newCategoryDescription').value.trim();

  // Check if the name is provided
  if (!name) {
    notify('rejected', "Provide the category's name!");
    return;
  }

  try {
    // Send the data to the backend for storage
    const response = await fetch('/api/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, description })
    });

    const data = await response.json();
    console.log(data);

    // Notify the chef
    notify(data.status, data.message);

    // Clear the form and remove from display if successful
    if (data.status === 'created') {
      clearForm();
      close();
      // Reload the window to mark the category present in other fields
      window.location.reload();
    }
  } catch (error) {
    alert('An error has occurred. Please try again!');
    console.error(error);
  }
}

/**
 * Sends a get request to the backend to retrieve a category's details by ID
 * It then fills the form UI elements with the category's information
 * @returns {Promise<void>} A Promise that resolves when the category is fetched
 */
export async function fetchCategory () {
  try {
    // Get the category's id
    const id = document.getElementById('updateCategorySelect').value;

    // Fetch the category's details
    const response = await fetch(`/api/category/${id}`);
    const data = await response.json();

    // Check if category exists
    if (data.status !== 'success') {
      notify(data.status, data.message);
      return;
    }
    // Populate the inputs of the update form
    document.getElementById('updateCategoryNumber').value = data.data.id;
    document.getElementById('updateCategoryName').value = data.data.name;
    document.getElementById('updateCategoryDescription').value = data.data.description;
  } catch (error) {
    alert('An error has occurred. Please try again!');
    console.error(error);
  }
}

/**
 * Sends a PUT request to the backend to update a category
 * @returns {Promise<void>} A promise that resolves when the backend returns a response
 */
export async function updateCategory () {
  try {
    // Fetch the category's new data
    const id = document.getElementById('updateCategoryNumber').value;
    const name = document.getElementById('updateCategoryName').value;
    const description = document.getElementById('updateCategoryDescription').value;

    // Send the PUT request
    const response = await fetch(`/api/category/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, description })
    });
    // Extract the response body
    const data = await response.json();

    // Notify the chef
    notify(data.status, data.message);

    // Exit if successful
    if (data.status === 'success') {
      close();
      clearForm();
    }
  } catch (error) {
    alert('An error has occurred. Please try again!');
    console.error(error);
  }
}

/**
 * Sends a DELETE request to the backend
 * @returns {Promise<void>} A promise that resolves when the backend responds
 */
export async function deleteCategory () {
  // Get the category's primary key
  const id = document.getElementById('deleteCategorySelect').value;
  const name = document.getElementById('deleteCategorySelect').selectedOptions[0].text;

  // Confirm if user wants to delete the category

  if (!confirm(`Are you sure you want to delete ${name}?\nDeleting it also removes the food items in the category!`)) return;

  try {
    // Send the delete request
    const response = await fetch(`/api/category/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    // Notify the chef
    notify(data.status, data.message);

    // Exit if successful
    if (data.status === 'success') {
      close();
      clearForm();
    }
  } catch (error) {
    alert('An error has occurred. Please try again!');
    console.error(error);
  }
}
