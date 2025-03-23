import { notify } from './util.js';

document.addEventListener('DOMContentLoaded', function () {
  newPaymentMethod();
  getPaymentMethods();
  getWaiterList();
  const orderDetails = document.getElementById('order-details');
  const paymentMethod = document.getElementById('payment-method');
  const waiter = document.getElementById('waiter');
  const sendToWaiterButton = document.getElementById('send-to-waiter');
  const incomingOrders = document.getElementById('incoming-orders');

  // here are the recently added payment calculation elements
  const totalAmountInput = document.getElementById('totalAmount');
  const amountPaidInput = document.getElementById('amountPaid');
  const balanceInput = document.getElementById('balance');
  const calculateBalanceButton = document.getElementById('calculateBalance');

  // Fetch orders from the backend
  async function fetchOrders () {
    try {
      // Fetch the list of unfinished orders from the backend
      const response = await fetch('/api/order/unfinished');
      const data = await response.json();

      // Check if orders exists
      if (data.status !== 'success') {
        notify(data.status, data.message);
        return;
      }

      displayOrders(data.list);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }

  // Display incoming orders
  function displayOrders (orders) {
    incomingOrders.innerHTML = '';
    if (orders.length > 0) {
      orders.forEach(order => {
        const orderItem = document.createElement('li');
        orderItem.textContent = `Table: ${order.tableNumber} - Total: KSH ${order.totalPrice.toFixed(2)}`;
        orderItem.addEventListener('click', () => {
          displayOrderDetails(order);
          sendToWaiterButton.dataset.orderId = order.id;
        });
        incomingOrders.appendChild(orderItem);
      });
    } else {
      incomingOrders.innerHTML = '<p>No incoming orders found.</p>';
    }
  }

  // Display order details and set total amount
  async function displayOrderDetails (order) {
    try {
      let orderHTML = `<h2>Table: ${order.tableNumber}</h2>`;

      // Fetch the list of items in the order
      const response = await fetch(`/api/orderFood/${order.id}`);
      const data = await response.json();

      // Check if the list was successfully fetched
      if (data.status !== 'success') {
        notify(data.status, data.message);
        return;
      }

      orderHTML += '<ul>';
      for (const item of data.list) {
        // Fetch the item's name
        const response = await fetch(`/api/food/${item.foodItem}`);
        const data = await response.json();

        // Check if the item was successfully retrieved
        if (data.status !== 'success') {
          notify(data.status, data.message);
          return;
        }

        //
        orderHTML += `<li>${item.quantity} ${data.data.name} @ KSH ${item.price.toFixed(2)}</li>`;
      }
      orderHTML += '</ul>';
      orderHTML += `<p>Total: KSH ${order.totalPrice.toFixed(2)}</p>`;
      orderDetails.innerHTML = orderHTML;

      // Set the total amount dynamically
      totalAmountInput.value = order.totalPrice.toFixed(2);
    } catch (error) {
      console.error(error);
    }
  }

  // function to calculate balance when button is clicked
  calculateBalanceButton.addEventListener('click', function () {
    const totalAmount = parseFloat(totalAmountInput.value) || 0;
    const amountPaid = parseFloat(amountPaidInput.value) || 0;

    if (amountPaid < totalAmount) {
      alert('Insufficient payment! Please enter a valid amount.');
      balanceInput.value = ''; // Clear balance field after the alert
      return;
    }

    const balance = amountPaid - totalAmount;
    balanceInput.value = balance.toFixed(2); // Display with 2 decimal places which includes the cents
  });

  // Send order to waiter
  sendToWaiterButton.addEventListener('click', async function () {
    const orderId = sendToWaiterButton.dataset.orderId;
    if (!orderId) {
      alert('Please select an order first.');
      return;
    }

    const requestData = {
      orderId,
      paymentMethod: paymentMethod.value,
      waiter: waiter.value,
      status: 'completed'
    };

    try {
      const response = await fetch('/api/update-order-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        alert('Order sent to waiter successfully!');
      } else {
        alert('Failed to update order status.');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  });

  // Load orders on page load
  fetchOrders();
});

/**
 * Sends a GET request to retrieve a list of payment methods
 * It then updates the dropdown options for payment method
 * @returns {Promise<void>} A promise that resolves when the UI is updated
 */
async function getPaymentMethods () {
  try {
    // Fetch the list of payment methods
    const response = await fetch('/api/paymentMethod');
    const data = await response.json();

    // Check if payment methods exists
    if (data.status !== 'success') return;

    const paymentMethod = document.getElementById('payment-method');

    // Populate the payment method UI
    data.list.forEach(method => {
      const option = document.createElement('option');
      option.value = method.id;
      option.textContent = method.name;
      paymentMethod.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
}

/**
 * Adds a new option in the payment methods dropdown
 * On clicking the option, it allows one to add a new payment method
 */
function newPaymentMethod () {
  const paymentMethod = document.getElementById('payment-method');
  const method = document.createElement('option');
  method.textContent = 'New Method';
  paymentMethod.appendChild(method);
  method.addEventListener('click', async () => {
    // Ask for the new method
    const name = prompt("Enter the new payment method's name?");
    const description = prompt('Describe the new payment method');

    try {
      // Send the method to the backend for storage
      const response = await fetch('/api/paymentMethod', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description })
      });
      const data = await response.json();

      // Notify if method was added successfully
      notify(data.status, data.message);

      // Reload the page if successful
      if (data.status === 'created') window.location.reload();
    } catch (error) {
      console.error(error);
    }
  });
}

/**
 * Sends a GET request to the backend to retrieve a list of waiters
 * It then updates the dropdown with the waiters' details
 * @returns {Promise<void>} A promise that resolves when the UI is updated
 */
async function getWaiterList () {
  try {
    // Send a GET request to the backend
    const response = await fetch('/api/user');
    const data = await response.json();

    // Check if any user exists
    if (data.status !== 'success') {
      alert('No waiters exist at the moment.\nPlease wait for the admin to add them first!');
      return;
    }

    // Extract users who are servers
    const servers = data.list.filter(user => user.role === 'server');

    // Get the waiter select dropdown
    const waiter = document.getElementById('waiter');

    // Clear previous options
    waiter.innerHTML = '';

    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Select a waiter';
    defaultOption.value = '';
    waiter.appendChild(defaultOption);

    // Append servers to dropdown
    servers.forEach(server => {
      const option = document.createElement('option');
      option.value = server.id;
      option.textContent = server.fullName;
      waiter.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
}
