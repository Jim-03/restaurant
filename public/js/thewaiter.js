document.addEventListener("DOMContentLoaded", function () {
    const ordersPreviewList = document.getElementById("ordersPreview");
    const ordersTaken = document.getElementById("ordersTaken");
    const saveOrderButton = document.getElementById("saveOrderButton");

    // Fetch orders from the database (sent by the cashier)
    function loadOrders() {
        fetch("fetch_orders.php") // Fetch orders from the database
            .then(response => response.json())
            .then(orders => {
                ordersPreviewList.innerHTML = "";
                orders.forEach(order => {
                    const listItem = document.createElement("li");
                    listItem.innerHTML = `Order ID: ${order.id} - ${order.items} - KSH ${order.total}`;

                    const takeOrderButton = document.createElement("button");
                    takeOrderButton.textContent = "Take Order";
                    takeOrderButton.addEventListener("click", function () {
                        moveToOrdersTaken(order, listItem);
                    });

                    listItem.appendChild(takeOrderButton);
                    ordersPreviewList.appendChild(listItem);
                });
            })
            .catch(error => console.error("Error fetching orders:", error));
    }

    // Move order to "Orders Served"
    function moveToOrdersTaken(order, listItem) {
        listItem.remove(); // Remove from orders preview

        const newListItem = document.createElement("li");
        newListItem.innerHTML = `Order ID: ${order.id} - ${order.items} - KSH ${order.total} - Served`;

        ordersTaken.appendChild(newListItem);
    }

    // Save the served orders to the database
    saveOrderButton.addEventListener("click", function () {
        const servedOrders = [];

        document.querySelectorAll("#ordersTaken li").forEach(orderItem => {
            const orderText = orderItem.textContent.split(" - ");
            const orderId = orderText[0].replace("Order ID: ", "").trim();
            servedOrders.push({ id: orderId });
        });

        if (servedOrders.length === 0) {
            alert("No orders to save!");
            return;
        }

        // Send served orders to the database
        fetch("save_orders.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ orders: servedOrders }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Orders saved successfully!");
                    ordersTaken.innerHTML = ""; // Clear served orders after saving
                } else {
                    alert("Failed to save orders.");
                }
            })
            .catch(error => console.error("Error saving orders:", error));
    });

    // Load initial orders when page loads
    loadOrders();
});
