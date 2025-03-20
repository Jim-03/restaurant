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
    async function fetchOrders() {
        try {
            const response = await fetch('/api/get-orders'); // Update with actual API endpoint
            const orders = await response.json();
            displayOrders(orders);
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
    function displayOrderDetails(order) {
        let orderHTML = `<h2>Order ID: ${order.id}</h2>`;
        orderHTML += '<ul>';
        order.items.forEach(item => {
            orderHTML += `<li>${item.name} - KSH ${item.price.toFixed(2)}</li>`;
        });
        orderHTML += '</ul>';
        orderHTML += `<p>Total: KSH ${order.total.toFixed(2)}</p>`;
        orderDetails.innerHTML = orderHTML;

        // Set the total amount dynamically
        totalAmountInput.value = order.total.toFixed(2);
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
