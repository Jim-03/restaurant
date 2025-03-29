const sequelize = require("./databaseConnection");

// Get the models
const user = require("./models/user_model");
const category = require("./models/category_model");
const food = require("./models/food_model");
const order = require("./models/order_model");
const orderedFood = require("./models/ordered_food_model");
const payment = require("./models/payment");
const paymentMethod = require("./models/payment_method");

/**
 * Define the relationships
 */

// A server can take many orders but an order is taken by a single server
user.hasMany(order, { foreignKey: "waiter_id" });
order.belongsTo(user, { foreignKey: "waiter_id" });

// A category can have many food items but each food item belongs to a specific category
category.hasMany(food, { foreignKey: "category_id" });
food.belongsTo(category, { foreignKey: "category_id" });

// An order can have many food items and a food item can have many orders
order.belongsToMany(food, { through: orderedFood, foreignKey: "order_id" });
food.belongsToMany(order, { through: orderedFood, foreignKey: "food_id" });

// An order has only one payment and each payment belongs to one order
order.hasOne(payment, { foreignKey: "order_id" });
payment.belongsTo(order, { foreignKey: "order_id" });

// Many payments can use the same method and each payment has one method
paymentMethod.hasMany(payment, { foreignKey: "payment_method_id" });
payment.belongsTo(paymentMethod, { foreignKey: "payment_method_id" });

// Drop existing tables and create new ones
sequelize
  .sync({ force: true, logging: false })
  .then(() => {
    console.log("Database & tables created!");

    // Create categories
    category.bulkCreate([
      {
        name: "Beverages",
        description: "Drinks including soft drinks, coffee, and tea",
      },
      {
        name: "Fast Food",
        description: "Quick meals such as burgers and fries",
      },
      { name: "Desserts", description: "Sweet dishes and baked goods" },
      { name: "Vegetarian", description: "Plant-based meals and sides" },
      { name: "Seafood", description: "Dishes made with fish and shellfish" },
    ]);

    console.log("Categories created!");

    // Create food items
    food.bulkCreate([
      { category: 1, name: "Iced Coffee", price: 3.99, stock: 50 },
      { category: 1, name: "Green Tea", price: 2.99, stock: 40 },
      { category: 1, name: "Orange Juice", price: 4.49, stock: 35 },
      { category: 1, name: "Lemonade", price: 3.49, stock: 45 },
      { category: 1, name: "Cola", price: 2.49, stock: 60 },
      { category: 2, name: "Cheeseburger", price: 5.49, stock: 30 },
      { category: 2, name: "French Fries", price: 2.99, stock: 50 },
      { category: 2, name: "Chicken Nuggets", price: 4.99, stock: 25 },
      { category: 2, name: "Hot Dog", price: 3.99, stock: 40 },
      { category: 2, name: "Veggie Burger", price: 5.99, stock: 20 },
      { category: 3, name: "Chocolate Cake", price: 4.99, stock: 20 },
      { category: 3, name: "Apple Pie", price: 3.99, stock: 25 },
      { category: 3, name: "Ice Cream", price: 2.99, stock: 30 },
      { category: 3, name: "Brownie", price: 3.49, stock: 15 },
      { category: 3, name: "Cheesecake", price: 5.99, stock: 10 },
      { category: 4, name: "Grilled Tofu", price: 6.99, stock: 15 },
      { category: 4, name: "Vegetable Stir-fry", price: 7.49, stock: 20 },
      { category: 4, name: "Lentil Soup", price: 4.99, stock: 30 },
      { category: 4, name: "Salad Bowl", price: 5.49, stock: 25 },
      { category: 4, name: "Veggie Wrap", price: 6.99, stock: 18 },
      { category: 5, name: "Grilled Salmon", price: 12.99, stock: 10 },
      { category: 5, name: "Shrimp Cocktail", price: 9.99, stock: 12 },
      { category: 5, name: "Fish Tacos", price: 7.99, stock: 15 },
      { category: 5, name: "Lobster Roll", price: 14.99, stock: 8 },
      { category: 5, name: "Crab Cakes", price: 11.99, stock: 10 },
    ]);
    console.log("Food Items added!");
  })
  .catch(console.error);
