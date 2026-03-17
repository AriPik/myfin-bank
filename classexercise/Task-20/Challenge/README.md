# 📚 Express REST API – Books Management

A modular REST API built with Express.js that manages a collection of books using full CRUD operations.

This project demonstrates:

* Express routing
* Custom middleware
* Modular route structure
* Global error handling
* REST API design principles

---

## 🚀 Features

* ✅ GET all books
* ✅ POST a new book
* ✅ PUT update existing book
* ✅ DELETE a book
* ✅ Custom logging middleware
* ✅ 404 route handling
* ✅ Centralized error handler
* ✅ Modular routing (`routes/books.js`)

---

## 📂 Project Structure

```
project/
│
├── server.js
├── package.json
└── routes/
    └── books.js
```

---

## 🛠 Installation & Setup

### 1️⃣ Clone or Download the Project

Navigate into the project folder:

```bash
cd project
```

### 2️⃣ Install Dependencies

Since `node_modules` is not included in submission, install it first:

```bash
npm install
```

This will install:

* express

---

## ▶️ Run the Server

```bash
node server.js
```

You should see:

```
Server running at http://localhost:4000
```

Server runs on:

```
http://localhost:4000
```

---

## 🧪 Testing the API

You can test using:

* curl (terminal)
* Postman
* Thunder Client

---

## 📌 API Endpoints

### 🔹 GET All Books

```
GET /books
```

```bash
curl http://localhost:4000/books
```

---

### 🔹 POST Add New Book

```
POST /books
```

```bash
curl -X POST http://localhost:4000/books \
-H "Content-Type: application/json" \
-d '{"title":"Atomic Habits","author":"James Clear"}'
```

Returns status: `201 Created`

---

### 🔹 PUT Update Book

```
PUT /books/:id
```

```bash
curl -X PUT http://localhost:4000/books/1 \
-H "Content-Type: application/json" \
-d '{"title":"Updated Title"}'
```

---

### 🔹 DELETE Book

```
DELETE /books/:id
```

```bash
curl -X DELETE http://localhost:4000/books/1
```

---

## 🧩 Middleware Implemented

### 🔹 Request Logger

Logs every incoming request with:

* Timestamp
* HTTP Method
* URL

Example log:

```
[2026-03-03T12:30:10.123Z] [GET] /books
```

---

### 🔹 404 Handler

If route does not exist:

```json
{
  "error": "Route not found"
}
```

---

### 🔹 Global Error Handler

Catches unexpected server errors and returns:

```json
{
  "error": "Internal Server Error"
}
```

---

## 🧠 Design Decisions

* Uses in-memory array (no database required)
* Modular routing for scalability
* Middleware layered correctly
* Proper HTTP status codes used:

  * 200 OK
  * 201 Created
  * 400 Bad Request
  * 404 Not Found
  * 500 Internal Server Error