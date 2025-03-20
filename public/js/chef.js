import {
  fetchCategoryList,
  clearForm,
  close,
  showCategoryOptions,
  addFood,
  searchFoodItems,
  updateFood,
  deleteFood,
  addCategory,
  fetchCategory,
  updateCategory,
  deleteCategory
} from './chef-util.js';

// DOM manipulators

/**
 * Add category options to all select elements
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Fetch the list of categories
  const categoryList = await fetchCategoryList();

  // Check if the list is provided
  if (!categoryList) return;

  // Show the options of categories on the form
  showCategoryOptions(categoryList);
});

/**
 * Stops all default submit events
 */
document.addEventListener('submit', (event) => {
  // Prevent all default submit events
  event.preventDefault();
});

/**
 * Displays the add food form
 */
document.getElementById('addFood').addEventListener('click', async () => {
  // Display the form
  document.getElementById('foodForm').style.display = 'flex';
});

/**
 * Click event listener on the add food button
 */
document.getElementById('addFoodButton').addEventListener('click', addFood);

/**
 * Clear all inputs of a form and close the form when the clear button is clicked
 */
document.querySelectorAll('.clearButton').forEach((button) => {
  button.addEventListener('click', () => {
    clearForm();
    close();
  });
});

/**
 * Displays the form to update a food item
 */
document.getElementById('updateFood').addEventListener('click', async () => {
  // Display the update form
  document.getElementById('updateForm').style.display = 'flex';
});

/**
 * Displays the form to delete a food item
 */
document.getElementById('deleteFood').addEventListener('click', () => {
  document.getElementById('deleteFoodBackground').style.display = 'flex';
});

/**
 * Adds the function to close all forms when the close button is clicked
 */
document.querySelectorAll('.closeButton').forEach((button) => {
  button.addEventListener('click', close);
});

/**
 * Searches for a food item when the search button of the update form is clicked
 */
document
  .getElementById('searchUpdateButton')
  .addEventListener('click', async () => {
    // Fetch the food item's data
    const food = await searchFoodItems(
      document.getElementById('searchFoodUpdate').value.trim()
    );

    // Check if food item exists
    if (!food) {
      return;
    }

    // Display the values on the UI
    const productNumber = document.getElementById('updateProductNumber');
    productNumber.value = food.id;
    const newName = document.getElementById('updatedFoodName');
    newName.value = food.name;
    const newPrice = document.getElementById('updatedFoodPrice');
    newPrice.value = food.price;
    const newCategory = document.getElementById('updatedFoodCategory');
    newCategory.value = food.category;
    const newStock = document.getElementById('updatedFoodStock');
    newStock.value = food.stock;
  });

/**
 * Updates a food item when the update button is clicked
 */
document
  .getElementById('updateFoodButton')
  .addEventListener('click', updateFood);

document
  .getElementById('searchDeleteButton')
  .addEventListener('click', async () => {
    // Fetch the food item's data
    const food = await searchFoodItems(
      document.getElementById('searchDeleteFood').value.trim()
    );

    // Get the delete food data container
    const deleteFoodData = document.getElementById('deleteFoodData');

    // Clear previous results
    deleteFoodData.innerHTML = '';

    // Check if food item exists
    if (!food) {
      deleteFoodData.innerHTML = '<p>Food item not found</p>';
      return;
    }

    // Display the food details
    deleteFoodData.innerHTML = `
      <p>Food Number: ${food.id}</p>
      <p>Name: ${food.name}</p>
      <p>Price: ${food.price} Ksh</p>
    `;

    const deleteButton = document.createElement('button');
    deleteButton.id = 'deleteFoodButton';
    deleteButton.className = 'deleteButton';
    deleteButton.textContent = 'Delete';

    // Append button to the div
    deleteFoodData.appendChild(deleteButton);

    document
      .getElementById('deleteFoodButton')
      .addEventListener('click', () => deleteFood(food.id));
  });

/**
 * Displays the form to add a category
 */
document.getElementById('addCategory').addEventListener('click', () => {
  document.getElementById('categoryForm').style.display = 'flex';
});

/**
 * Displays the form to update a category
 */
document.getElementById('updateCategory').addEventListener('click', () => {
  document.getElementById('updateCategoryForm').style.display = 'flex';
});

/**
 * Displays a form that deletes a category
 */
document.getElementById('deleteCategory').addEventListener('click', () => {
  document.getElementById('deleteCategoryForm').style.display = 'flex';
});

/**
 * Event listeners to the category CRUD operations
 */
document.getElementById('addCategoryButton').addEventListener('click', addCategory);
document.getElementById('updateCategorySelect').addEventListener('change', fetchCategory);
document.getElementById('updateCategoryButton').addEventListener('click', updateCategory);
document.getElementById('deleteCategorySelect').addEventListener('change', deleteCategory);
