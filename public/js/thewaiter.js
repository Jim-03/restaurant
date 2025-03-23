import { getUserData, notify } from './util.js';

const ordersPreviewList = document.getElementById('ordersPreview');
const ordersTaken = document.getElementById('ordersTaken');
const saveOrderButton = document.getElementById('saveOrderButton');
document.addEventListener('DOMContentLoaded', loadOrders);

/**
 * Sends a GET request to retrieve a list of orders that were assigned to a waiter/waitress
 * It then filters the orders either as new orders or already completed orders
 * @returns {Promise<void>} A promise that resolves when the orders are fully loaded
 */
async function loadOrders () {
  // Get the user's details
  const id = getUserData().id;
  const role = getUserData().role;
  // Ensure the role is authorized
  if (role !== 'server' && role !== 'admin') {
    // Relocate to unauthorized page
    window.location.href = '/unauthorized';
    return;
  }

  try {
    // Fetch the list of orders
    const response = await fetch(`/api/order/server/${id}`);
    const data = await response.json();

    // Check if the orders were successfully retrieved
    if (data.status !== 'success') {
      notify(data.status, data.message);
      return;
    }

    const orders = data.list;

    // Iterate through each order and separate them
    const assignedOrders = [];
    const takenOrders = [];

    orders.forEach((order) => {
      if (order.orderStatus === 'unpaid') {
        assignedOrders.push(order);
      } else if (order.orderStatus !== 'cancelled') {
        takenOrders.push(order);
      }
    });

    // Add each list to the UI
    loadAssignedOrders(assignedOrders);
    loadTakenOrders(takenOrders);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Displays the orders that have been assigned to a waiter/waitress
 * @param {Array} orders A list of newly assigned orders
 * @returns {Promise<void>} A promise that resolves when the list is fully displayed
 */
async function loadAssignedOrders (orders) {
  try {
    // Empty the list
    ordersPreviewList.innerHTML = '';

    // Check if there are any orders
    if (orders.length === 0) {
      const listItem = document.createElement('li');
      listItem.innerHTML = 'There are no orders at the moment!';
      ordersPreviewList.appendChild(listItem);
      return;
    }

    for (const order of orders) {
      const listItem = document.createElement('li');

      // Fetch the food item's in the order
      const items = await getItemList(order.id);

      // Check if the items were retrieved
      if (!items) return;

      let itemList = '';

      // Create a food list string
      itemList = await createFoodList(items);

      listItem.innerHTML = `Table ${order.tableNumber}: ${itemList}`;
      const cancelOrderButton = document.createElement('button');
      cancelOrderButton.textContent = 'Cancel';
      cancelOrderButton.style.backgroundColor = 'red';
      cancelOrderButton.style.color = 'white';
      cancelOrderButton.addEventListener('click', () => {
        updateOrder(order.id, 'cancelled');
      });
      const takeOrderButton = document.createElement('button');
      takeOrderButton.textContent = 'Take Order';
      takeOrderButton.addEventListener('click', function () {
        updateOrder(order.id, 'processing');
      });
      listItem.appendChild(cancelOrderButton);
      listItem.appendChild(takeOrderButton);
      ordersPreviewList.appendChild(listItem);
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * Sends a PUT request to the backend to update the order's details
 * @param {Number} id The order's primary key
 * @param {string: "processing" | "cancelled"} orderStatus the order's new status
 * @returns {Promise<void>} A promise that resolves when the order is updated
 */
async function updateOrder (id, orderStatus) {
  try {
    // Send the PUT request
    const response = await fetch(`/api/order/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orderStatus })
    });

    const data = await response.json();

    // Notify the server
    notify(data.status, data.message);

    // Reload the page's components
    loadOrders();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Displays a list of orders that the waiter/waitress has taken
 * @param {Array} orders The list of orders
 * @returns {Promise<void>} A promise that resolves when the orders are displayed
 */
async function loadTakenOrders (orders) {
  try {
    // Empty the list
    ordersTaken.innerHTML = '';

    // Check if there are any orders
    if (orders.length === 0) {
      const listItem = document.createElement('li');
      listItem.innerHTML = 'There are no orders at the moment!';
      ordersTaken.appendChild(listItem);
      return;
    }

    for (const order of orders) {
      const listItem = document.createElement('li');

      // Fetch the food item's in the order
      const items = await getItemList(order.id);

      // Check if the items were retrieved
      if (!items) return;

      let itemList = '';

      // Create a food list string
      itemList = await createFoodList(items);

      // Format the date
      const formattedDate = new Date(order.updatedAt).toLocaleString('en-KE', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      // Construct a user-friendly string
      listItem.innerHTML = `
  <strong>${formattedDate}</strong> - Table <strong>${order.tableNumber}</strong>: 
  ${itemList} <br> 
`;

      ordersTaken.appendChild(listItem);
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * Retrieves a list of items that exist in an order
 * @param {number} id The order's primary ley
 * @returns {Promise<Array | null | undefined>} The list of items or null
 */
async function getItemList (id) {
  // Fetch the list of items in the order
  const response = await fetch(`/api/orderFood/${id}`);
  const data = await response.json();

  // Notify in case of any errors
  if (data.status !== 'success') {
    notify(data.status, data.message);
    return;
  }

  return data.list;
}

/**
 * Creates a string from a list of items to be displayed on the UI
 * @param {Array} items The list of items
 * @returns {Promise<string>} A string containing the list of items
 */
async function createFoodList (items) {
  let list = '';
  for (const item of items) {
    // Get the item's data
    const response = await fetch(`/api/food/${item.foodItem}`);
    const data = await response.json();

    list += ` (${item.quantity} ${data.data.name}) `;
  }
  return list;
}
