// // ==========================================
// // MongoDB Retail System Migration Assignment
// // ==========================================

// Switch to database
db = db.getSiblingDB("retailDB");

// Drop entire database (makes script re-runnable safely)
db.dropDatabase();

// ==========================================
// 1. PRODUCT CATALOG
// ==========================================

const productResult = db.products.insertMany([
  {
    name: "iPhone 15",
    category: "Electronics",
    price: 79999,
    stock: { available: 120 },
    specifications: { brand: "Apple", storage: "128GB" },
    createdAt: new Date()
  },
  {
    name: "Running Shoes",
    category: "Footwear",
    price: 2999,
    stock: { available: 300 },
    specifications: { brand: "Nike", size: 9 },
    createdAt: new Date()
  }
]);

// Store inserted product IDs
const iphoneId = productResult.insertedIds[0];
const shoesId = productResult.insertedIds[1];

// ==========================================
// 2. USER AUTHENTICATION
// ==========================================

const userResult = db.users.insertMany([
  {
    username: "arijit_dev",
    email: "arijit@example.com",
    passwordHash: "hashed_password_123",
    role: "customer",
    createdAt: new Date()
  },
  {
    username: "rahul123",
    email: "rahul@example.com",
    passwordHash: "hashed_password_456",
    role: "customer",
    createdAt: new Date()
  }
]);

// Store inserted user IDs
const arijitId = userResult.insertedIds[0];
const rahulId = userResult.insertedIds[1];

// ==========================================
// 3. CUSTOMER ORDERS
// ==========================================

db.orders.insertOne({
  userId: arijitId,
  orderDate: new Date(),
  items: [
    {
      productId: iphoneId,
      name: "iPhone 15",
      quantity: 1,
      price: 79999
    }
  ],
  totalAmount: 79999,
  paymentStatus: "Completed",
  orderStatus: "Shipped"
});

// ==========================================
// 4. INDEXING STRATEGY
// ==========================================

// Optimize product search by category
db.products.createIndex({ category: 1 });

// Optimize filtering + sorting by category and price
db.products.createIndex({ category: 1, price: 1 });

// Optimize retrieving orders by user
db.orders.createIndex({ userId: 1 });

// Ensure unique user emails
db.users.createIndex({ email: 1 }, { unique: true });

// ==========================================
// 5. SAMPLE QUERIES
// ==========================================

// Retrieve products by category
db.products.find({ category: "Electronics" });

// Retrieve orders for Arijit
db.orders.find({ userId: arijitId });

// User login query
db.users.findOne({ email: "arijit@example.com" });