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
