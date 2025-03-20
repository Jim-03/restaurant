import { notify } from "./util.js";

document.addEventListener('DOMContentLoaded', function () {
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
    function displayOrders(orders) {
        incomingOrders.innerHTML = '';
        if (orders.length > 0) {
            orders.forEach(order => {
                const orderItem = document.createElement('li');
                orderItem.textContent = `Order ID: ${order.id} - Total: KSH ${order.total.toFixed(2)}`;
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
        balanceInput.value = balance.toFixed(2); // Display with 2 decimal places which inludes the cents
    });

    // Send order to waiter
    sendToWaiterButton.addEventListener('click', async function () {
        const orderId = sendToWaiterButton.dataset.orderId;
        if (!orderId) {
            alert('Please select an order first.');
            return;
        }

        const requestData = {
            orderId: orderId,
            paymentMethod: paymentMethod.value,
            waiter: waiter.value,
            status: 'Sent to Waiter'
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
