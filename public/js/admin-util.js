import { notify } from "./util.js";
import {getDateRange} from './admin.js'

/**
 * Retrieves the general report of the entire system's data
 * @returns {Promise<null|{totalSales: string, avgValue: string, topSellingItem: string, ordersProcessed: *, lowStockItems: number, mostUsedItem: string, stockValue: string, totalItems: number}>} An object containing the general system's data
 */
export async function getReport() {
  try {
    // Fetch the list of orders for the specified data
    let dates = getDateRange();
    let response = await fetch(`/api/order/date`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dates),
    });
    let data = await response.json();

    console.log(data)
    // Check if the orders were retrieved successfully
    if (data.status !== "success") {
      notify(data.status, data.message);
      return;
    }


    // Extract the list of orders
    let orders = data.list;

    let totalSales = 0;
    let orderCount = orders.length;
    let itemCounts = {};
    let stockValues = {};
    let allItems = [];

    // Iterate over the orders list
    for (const order of orders) {
      // Fetch the ordered food items in the order
      let itemResponse = await fetch(`/api/orderFood/${order.id}`);
      let data = await itemResponse.json();

      // Check if the food list was retrieved  successfully
      if (data.status !== "success") {
        notify(data.status, data.message);
        return;
      }

      // Add the food list to a list of all food items
      allItems = allItems.concat(data.list);

      // Add the order's total price to the overall price
      totalSales += order.totalPrice;

      // Iterate through each item in the order
      for (const orderedItem of data.list) {
        // Fetch the item's details
        const response = await fetch(`/api/food/${orderedItem.foodItem}`);
        const data = await response.json();
        const item = data.data;
        itemCounts[item.name] =
          (itemCounts[item.name] || 0) + orderedItem.quantity;
        stockValues[item.name] =
          (stockValues[item.name] || 0) +
          orderedItem.quantity * orderedItem.price;
      }
    }

    let topSellingItem = Object.keys(itemCounts).reduce(
      (a, b) => (itemCounts[a] > itemCounts[b] ? a : b),
      ""
    );
    let lowStockItems = Object.keys(itemCounts).filter(
      (item) => itemCounts[item] < 5
    );
    let mostUsedItem = Object.keys(itemCounts).reduce(
      (a, b) => (stockValues[a] > stockValues[b] ? a : b),
      ""
    );
    let totalItems = allItems.length;
    let stockValue = Object.values(stockValues).reduce((a, b) => a + b, 0);

    return {
      totalSales: totalSales.toFixed(2),
      avgValue: (totalSales / orderCount).toFixed(2),
      topSellingItem: topSellingItem,
      ordersProcessed: orderCount,
      lowStockItems: lowStockItems.length,
      mostUsedItem: mostUsedItem,
      stockValue: stockValue.toFixed(2),
      totalItems: totalItems,
    };
  } catch (error) {
    console.error("Error fetching order data:", error);
    return null
  }
}
