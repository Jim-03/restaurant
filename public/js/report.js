import {
  notify,
  getMealsInOrder,
  getFoodDetails,
  getUserDetails
} from './util.js';

const orderSection = document.getElementById('orderSection');
const waiterSection = document.getElementById('waiterSection');

document.addEventListener('DOMContentLoaded', async () => {
  // Fetch the list of orders
  const orders = await getOrders();

  if (!orders) return;

  // Display the list of orders
  await displayOrders(orders);

  // Retrieve the list of waiters
  const waiters = await getWaiters();

  if (!waiters) return;

  // Display waiters
  await displayWaiters(waiters);

  // Create a print button
  const print = document.createElement('button');
  print.textContent = 'Print report';
  print.addEventListener('click', () => {
    window.print();
  });

  // Append the button to the end of the document
  const main = document.getElementById('main');
  main.appendChild(print);
});

/**
 * Retrieves a list of completed orders
 * @returns {Promise<Array|null>} A list of completed orders or null
 */
async function getOrders () {
  // Retrieve the start and end date
  const dates = JSON.parse(sessionStorage.getItem('dates'));

  try {
    // Fetch the orders on the specified date
    const ordersResponse = await fetch('/api/order/date', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dates)
    });

    const orderData = await ordersResponse.json();

    // Check if the response is okay
    if (orderData.status !== 'success') {
      notify(orderData.status, orderData.message);
      return null;
    }

    // Return the list of orders
    return orderData.list.filter((order) => order.orderStatus === 'completed');
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Displays the list of orders on the UI
 * @param {Array} orders A list of completed orders
 * @returns {Promise<void>} A promise that resolves when the orders are displayed
 */
async function displayOrders (orders) {
  // Get the total price of the orders
  let total = 0;

  // Clear out the section's previous content
  orderSection.innerHTML = '';
  // Check if the orders are provided
  if (!orders || orders.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'There are no orders at the specified period!';
    p.style.color = 'red';
    orderSection.appendChild(p);
    return;
  }

  try {
    // Iterate through each order adding it to the UI
    for (const order of orders) {
      const h3 = document.createElement('h3');
      h3.textContent = `Table ${order.tableNumber}`;
      h3.classList = 'orderHeader';

      const div = document.createElement('div');
      div.classList = 'meals';

      const ul = document.createElement('ul');

      // Fetch the list of meals in the order
      const meals = await getMealsInOrder(order.id);

      for (const orderedFood of meals) {
        // Get the food item's data
        const food = await getFoodDetails(orderedFood.foodItem);

        const li = document.createElement('li');
        li.innerHTML = `${orderedFood.quantity} ${food.name} @ ${orderedFood.price} KSh`;
        ul.appendChild(li);
      }
      div.appendChild(ul);
      const totalPrice = document.createElement('p');
      totalPrice.classList = 'total-order-price';
      totalPrice.innerHTML = `${order.totalPrice} Ksh`;
      total += order.totalPrice;

      // Get the waiter's details
      const waiter = await getUserDetails(order.waiter);
      const inCharge = document.createElement('p');
      inCharge.innerHTML = `Waiter in charge: ${waiter.fullName}`;

      const orderElement = document.createElement('section');
      orderElement.classList = 'order';
      orderElement.appendChild(h3);
      orderElement.appendChild(div);
      orderElement.appendChild(totalPrice);
      orderElement.appendChild(inCharge);

      orderSection.appendChild(orderElement);
    }

    // Add the total revenue tag
    const totalRevenue = document.createElement('p');
    totalRevenue.textContent = `Period Total: ${total}`;
    orderSection.appendChild(totalRevenue);
  } catch (error) {
    notify('rejected', 'An unexpected error has occurred!');
    console.error(error);
  }
}

/**
 * Retrieves a list of users who are servers
 * @returns {Promise<*[]|null>} A list of servers or null
 */
async function getWaiters () {
  try {
    const response = await fetch('/api/user');
    const data = await response.json();

    // Check if response was okay
    if (data.status !== 'success') return null;

    // Return the list of waiters
    const waiters = [];
    data.list.forEach((user) => {
      if (user.role === 'server') waiters.push(user);
    });

    return waiters;
  } catch (error) {
    notify('rejected', 'An error has occurred!');
    console.error(error);
  }
}

/**
 * Displays the list of servers and there total completed orders
 * @param {Array} waiters The list of waiters
 * @returns {Promise<void>} A promise that resolves once the waiters are displayed
 */
async function displayWaiters (waiters) {
  const waiterAndOrders = []; // A list of waiters and the number of orders they've made

  // Check if the waiter list is empty
  if (waiters.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'No waiters found!';
    p.style.color = 'red';
    waiterSection.appendChild(p);
    return;
  }

  const ol = document.createElement('ol');

  // Iterate through the waiters list and get the total orders they've made
  for (const waiter of waiters) {
    try {
      // Fetch the orders assigned to the waiter and are complete
      const response = await fetch(`/api/order/server/${waiter.id}`);
      const data = await response.json();

      // Check if the waiter has made any orders
      if (data.status !== 'success') {
        notify('rejected', data.message);
        continue;
      }

      // Count completed orders
      const completedOrders = data.list.filter(
        (order) => order.orderStatus === 'completed'
      ).length;

      // Append the waiter and number of completed orders
      waiterAndOrders.push({
        waiter: waiter.fullName,
        orders: completedOrders
      });
    } catch (error) {
      console.error(error);
      return;
    }
  }

  // Sort by highest completed orders first
  waiterAndOrders.sort((a, b) => b.orders - a.orders);

  // Create and append list items in order
  waiterAndOrders.forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = `${entry.waiter}: ${entry.orders} completed orders`;
    ol.appendChild(li);
  });

  waiterSection.appendChild(ol);
}
