import { CART, reloadCart } from './cart.js';

/**
 * Displays a notification on the web browser
 * @param {"rejected" | "success" | "created" | "duplicated" | "not_found"} type The type of message to be displayed
 * @param {string} message The message
 */
export function notify (type, message) {
  // Determine the notification color
  let textColor = 'black';
  if (type === 'success') textColor = 'green';
  else if (type === 'created') textColor = 'darkGreen';
  else if (type === 'rejected') textColor = 'red';
  else if (type === 'duplicated') textColor = 'blue';

  // Get the notification tag
  const notice = document.getElementById('notification');

  // Remove existing notification if any
  notice.textContent = '';

  // Set the text
  notice.textContent = message;

  // Set the color of the message
  notice.style.color = textColor;

  // Display for 3 seconds
  notice.style.display = 'block';
  setTimeout(() => {
    notice.style.display = 'none';
  }, 3000);
}

/**
 * Displays the list of food items in the display section in the main menu
 * @param {Array} foodList The list of food items
 */
export function displayFood (foodList) {
  const display = document.getElementById('displaySection');

  // Iterate through each item and add to the display section
  foodList.forEach((foodItem) => {
    // Create the food section
    const foodSection = document.createElement('section');
    foodSection.setAttribute('class', 'foodItem');

    // The food's name
    const foodName = document.createElement('p');
    foodName.setAttribute('class', 'foodName');
    foodName.textContent = foodItem.name;

    // The food's price
    const foodPrice = document.createElement('p');
    foodPrice.setAttribute('class', 'foodPrice');
    foodPrice.textContent = `Ksh  ${foodItem.price}`;

    // Add to cart button
    const button = document.createElement('button');
    button.textContent = 'Add to cart';
    button.addEventListener('click', () => {
      // Create an ordered item
      const orderedItem = {
        foodId: foodItem.id,
        foodName: foodItem.name,
        quantity: 1,
        price: foodItem.price,
        totalPrice: foodItem.price
      };

      // Add the food item to the cart
      CART.push(orderedItem);
      reloadCart();
    });
    foodSection.appendChild(foodName);
    foodSection.appendChild(foodPrice);
    foodSection.appendChild(button);
    display.appendChild(foodSection);
  });
}

/**
 * Retrieves a user's details from the session storage
 * @returns {{
 *     id: Number,
 *     username: string,
 *     fullName: string,
 *     role: string,
 *     gender: "male" | "female",
 *     phone: string,
 *     email: string
 * }} The user object
 */
export function getUserData () {
  return JSON.parse(sessionStorage.getItem('userData'));
}

/**
 * Retrieves a list of ordered meals in an order
 * @param {Number} id The order's primary key
 * @returns {Promise<Array|null>} The list of ordered food or null
 */
export async function getMealsInOrder (id) {
  try {
    const response = await fetch(`/api/orderFood/${id}`);
    const data = await response.json();
    return data.list;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Retrieves a food item's details
 * @param {Number} id The food items primary key
 * @returns {Promise<Object|null>} The food item's data
 */
export async function getFoodDetails (id) {
  try {
    const response = await fetch(`/api/food/${id}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Retrieves a user's details
 * @param {Number} id The user's primary key
 * @returns {Promise<Object|null>} The user's details or null
 */
export async function getUserDetails (id) {
  try {
    const response = await fetch(`/api/user/${id}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
