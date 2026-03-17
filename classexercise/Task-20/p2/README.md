
# 📘 SkillSphere LMS API

### Day 20 — Basic Routing & Route Middleware (Express.js)

A foundational Express.js backend implementing dynamic routing and route-level middleware validation for a Learning Management System (LMS).

---

## 🚀 Overview

This project demonstrates:

* Express server setup
* Dynamic route parameters
* Route-level middleware
* Input validation
* Clean project structure
* Consistent JSON responses

It simulates a basic course API for the **SkillSphere LMS backend**.

---

## 🏗 Project Structure

```
project/
│
├── server.js
├── package.json
└── routes/
    └── courses.js
```

---

## 🛠 Tech Stack

* Node.js
* Express.js

---

## 📦 Installation

Since `node_modules` is not included in submission:

```bash 
npm install
```

---

## ▶️ Running the Server

```bash 
node server.js
```

Server will start at:

```
http://localhost:4000
```

---

# 📌 API Endpoints

---

## 🟢 1. Home Route

### `GET /`

Returns a welcome message to verify the server is running.

### Response

```json 
{
  "message": "Welcome to SkillSphere LMS API"
}
```

---

## 🟢 2. Get Course by ID

### `GET /courses/:id`

Retrieves course details dynamically using a route parameter.

### Example

```
GET /courses/101
```

### Response

```json 
{
  "id": "101",
  "name": "React Mastery",
  "duration": "6 weeks"
}
```

---

## 🔴 3. Validation Middleware

A route-level middleware `validateCourseId` ensures that:

* Course ID must be numeric
* Invalid requests are rejected early

### Example (Invalid Request)

```
GET /courses/abc
```

### Response

```json
{
  "error": "Invalid course ID"
}
```

**Status Code:** `400 Bad Request`

---

# 🧠 Key Concepts Implemented

* ✔ Dynamic routing with `req.params`
* ✔ Route-level middleware
* ✔ Input validation best practices
* ✔ Modular route organization
* ✔ JSON-first API design
* ✔ Proper HTTP status codes

---

# 🧩 Middleware Architecture

### 🔹 Route-Level Middleware

`validateCourseId`

* Checks `req.params.id`
* Prevents invalid requests from reaching the main controller
* Improves maintainability and separation of concerns

---

# 🧪 Testing the API

We can test using:

* Browser
* curl
* Postman
* Thunder Client

Example using curl:

```bash 
curl http://localhost:4000/courses/101
```

---

# 📌 Best Practices Followed

* Organized routes in separate files
* Isolated validation logic
* Consistent JSON responses
* Clear HTTP status codes
* Clean and scalable structure

---

# ⚠️ Notes

* This project uses static course data (no database integration).
* Designed for learning routing and middleware concepts.
* Easily extendable for future CRUD or database features.