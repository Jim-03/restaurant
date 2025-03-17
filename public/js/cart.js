import { notify } from './util.js';

export const CART = [];

/**
 * Re-displays items in the cart section
 */
export function reloadCart () {
  // Get the cart section
  const cartSection = document.getElementById('cartSection');

  // Clear out the previous content if any
  cartSection.innerHTML = '';

  // Holds the overall total for the item's in the cart
  let cumulativeTotalPrice = 0;

  // Iterate through each item in the cart
  CART.forEach((item, index) => {
    // Create the ordered food container
    const orderedFood = document.createElement('section');
    orderedFood.classList.add('orderedFood');

    // Create its name tag
    const foodName = document.createElement('p');
    foodName.classList.add('orderedFoodName');
    foodName.textContent = item.foodName;

    // Add the reduce quantity button
    const reduceButton = document.createElement('button');
    reduceButton.classList = 'reduceQuantity';
    reduceButton.textContent = '-';
    reduceButton.addEventListener('click', () => {
      if (item.quantity > 1) {
        item.quantity--;
        item.totalPrice = item.price * item.quantity;
        reloadCart();
      }
    });

    // Create the input field
    const quantityInput = document.createElement('input');
    quantityInput.type = 'text';
    quantityInput.value = item.quantity;
    quantityInput.min = 1;
    quantityInput.readOnly = true;

    // Add the increase quantity button
    const addButton = document.createElement('button');
    addButton.classList = 'addQuantity';
    addButton.textContent = '+';
    addButton.addEventListener('click', () => {
      item.quantity++;
      item.totalPrice = item.price * item.quantity;
      reloadCart();
    });

    // Create the price for a single item
    const price = document.createElement('p');
    price.classList = 'orderedFoodPrice';
    price.textContent = `Price: ${item.price} Ksh`;

    // Create the total price
    const totalPrice = document.createElement('p');
    totalPrice.classList = 'orderedFoodTotalPrice';
    totalPrice.textContent = `Total: ${item.totalPrice} Ksh`;

    // Add the button to remove a food item from the cart
    const removeButton = document.createElement('button');
    removeButton.classList = 'removeButton';
    removeButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    removeButton.addEventListener('click', () => {
      CART.splice(index, 1);
      reloadCart();
    });

    // Add the total price for the food item to the cumulative total
    cumulativeTotalPrice += item.totalPrice;

    // Append the components to the container
    orderedFood.appendChild(foodName);
    orderedFood.appendChild(reduceButton);
    orderedFood.appendChild(quantityInput);
    orderedFood.appendChild(addButton);
    orderedFood.appendChild(price);
    orderedFood.appendChild(totalPrice);
    orderedFood.appendChild(removeButton);

    // Append the container to the cart section
    cartSection.appendChild(orderedFood);
  });

  // Create the calculation div holding the order's actions and its total
  const calculationsDiv = document.createElement('div');
  calculationsDiv.id = 'calculations';
  const total = document.createElement('p');
  total.id = 'CumulativeTotal';
  total.textContent = `Price: ${cumulativeTotalPrice} Ksh`;
  const orderButton = document.createElement('button');
  orderButton.id = 'orderButton';
  orderButton.textContent = 'Order';
  orderButton.addEventListener('click', makeOrder);
  const clearButton = document.createElement('button');
  clearButton.id = 'clearButton';
  clearButton.textContent = 'Clear';
  clearButton.addEventListener('click', clearOrder);

  calculationsDiv.appendChild(total);
  calculationsDiv.appendChild(orderButton);
  calculationsDiv.appendChild(clearButton);
  cartSection.appendChild(calculationsDiv);
}

async function makeOrder () {
  // Create a new order object
  const order = {
    // Extract the total price of the order
    totalPrice: getTotalPrice(),
    // Get the table number from the user
    tableNumber: prompt('Identify the table number'),
    // Create the order status as processing
    orderStatus: 'processing'
  };

  // Send the order to the database

  const response = await fetch('/api/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(order)
  });

  const data = await response.json();

  // Check if the order was made successfully
  if (data.status !== 'created') {
    alert(data.message);
    return;
  }

  // Iterate through each item in the cart adding it to the database
  for (const item of CART) {
    // Create the ordered item
    const orderedItem = {
      order: data.id,
      foodItem: item.foodId,
      quantity: item.quantity,
      price: item.totalPrice
    };

    // Add the food item to the database
    const foodDatabaseResponse = await fetch('/api/orderFood', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderedItem)
    });

    const foodResponse = await foodDatabaseResponse.json();

    // Check if food was added to the order
    if (foodResponse.status !== 'success') {
      notify('success', foodResponse.message);
    }
  }

  // Notify the user to wait for the order to be resolved
  notify('success', data.message);
  clearOrder();
}

/**
 * Empties the CART array
 */
function clearOrder () {
  // Empty the cart
  CART.length = 0;
  reloadCart();
}

/**
 * Retrieves the cumulative total price of all items in the cart
 * @returns {Number} The total price
 */
function getTotalPrice () {
  let totalPrice = 0;
  CART.forEach((item) => {
    totalPrice += item.totalPrice * item.quantity;
  });

  return totalPrice;
}
