import { displayFood } from './util.js';

const display = document.getElementById('displaySection');

document.addEventListener('DOMContentLoaded', async () => {
  try {
    loadCategories();
    // Fetch the list of food items from the first category
    const backendResponse = await fetch('/api/food/category/1');
    const data = await backendResponse.json();

    // Check if food list is empty and display
    if (data.status !== 'success') {
      display.innerHTML = `<p id="responses">${data.message}</p>`;
      return;
    }
    // Display the food items
    displayFood(data.list);
  } catch (error) {
    console.error(error);
    alert('An error has occurred. Please try again!');
  }
});

/**
 * Loads the categories from the database to the navigation bar
 */
async function loadCategories () {
  // Get the navigation bar
  const navBar = document.getElementById('categories');

  // Clear out the navBar
  navBar.innerHTML = '';

  try {
    // Fetch the list of categories
    const categories = await fetch('/api/category');
    const data = await categories.json();

    // Check if categories exist
    if (data.status !== 'success') {
      alert(data.message);
    }

    // Iterate through each category and add it to the UI
    data.list.forEach((category) => {
      const button = document.createElement('button');
      button.id = category.name;
      button.textContent = category.name;
      button.addEventListener('click', async () => {
        // Clear out the display section
        display.innerHTML = '';

        // Fetch the list of items in this category
        const response = await fetch(`/api/food/category/${category.id}`);
        const foodData = await response.json();

        // Check if the list was obtained successfully
        if (foodData.status !== 'success') {
          display.innerHTML = `<p id="responses">${foodData.message}</p>`;
          return;
        }

        // Display the food items
        displayFood(foodData.list);
      });

      // Append the button to the navigation bar
      navBar.appendChild(button);
    });
  } catch (error) {
    console.error(error);
    alert('An error has occurred. Please try again!');
  }
}

document.getElementById('searchButton').addEventListener('click', async (event) => {
  // Prevent default submit event
  event.preventDefault();

  // Obtain the search bar's input value
  const itemToSearch = document.getElementById('searchInput').value;

  if (!itemToSearch || itemToSearch.length === 0) return;

  // Clear out the display section
  document.getElementById('displaySection').innerHTML = '';

  try {
    // Send the get request
    const response = await fetch(`/api/food/list/${itemToSearch}`);
    const data = await response.json();

    // Check if the response is okay
    if (data.status !== 'success') {
      // Notify via the display

      const p = document.createElement('p');
      p.textContent = `${data.message}`;

      document.getElementById('displaySection').appendChild(p);
      return;
    }

    // Display the list
    displayFood(data.list);
  } catch (e) {
    alert('An error has occurred. Please try again!');
    console.error(e);
  }
});
