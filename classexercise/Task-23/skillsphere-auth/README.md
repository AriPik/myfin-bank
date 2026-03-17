# SkillSphere LMS Backend

SkillSphere is a **Node.js + Express Learning Management backend** that demonstrates authentication, RESTful APIs, file uploads, and real-time communication.

This project was built as part of the Day-23 and Day-24 backend assignments, focusing on API design, middleware, file handling, and WebSocket communication.

---

# Features

## Authentication System

* User registration and login
* Passport.js authentication
* Session-based login management

Accessible routes:

```
/login
/register
```

---

# Course Management (REST API)

Implements a versioned REST API for managing courses.

API Base:

```
/api/v1/courses
```

Supported operations:

| Method | Endpoint              | Description     |
| ------ | --------------------- | --------------- |
| GET    | `/api/v1/courses`     | Get all courses |
| POST   | `/api/v1/courses`     | Create a course |
| PUT    | `/api/v1/courses/:id` | Update a course |
| DELETE | `/api/v1/courses/:id` | Delete a course |

Features implemented:

* RESTful routing
* Input validation
* Rate limiting
* Centralized error handling

A **frontend interface** is available for testing:

```
/courses.html
```

---

# File Upload System

Allows instructors to upload course materials.

Endpoint:

```
POST /upload
```

Features:

* Uses **Multer**
* Accepts **PDF files only**
* Stores files in:

```
/uploads
```

Frontend interface:

```
/upload.html
```

Uploaded files can be downloaded from:

```
/materials/<filename>.pdf
```

Example:

```
http://localhost:3000/materials/module1.pdf
```

---

# Real-Time Chat

Real-time communication between users using **Socket.io**.

Accessible via:

```
/chat.html
```

Features:

* Instant message broadcasting
* Multiple users supported
* Demonstrates WebSocket-based communication

To test:

* Open **two browser tabs**
* Send messages
* Messages appear instantly on both tabs

---

# Project Structure

```
SkillSphere/
│
├── app.js
├── server.js
│
├── routes/
│   ├── auth.js
│   └── courses.js
│
├── middleware/
│   ├── errorHandler.js
│   └── rateLimiter.js
│
├── config/
│   └── passport.js
│
├── public/
│   ├── chat.html
│   ├── upload.html
│   └── courses.html
│
├── uploads/
│
├── views/
│   └── home.ejs
│
├── package.json
└── README.md
```

---

# Installation

Clone the repository and install dependencies.

```
npm install
```

Required dependencies include:

* express
* mongoose
* passport
* express-session
* multer
* socket.io
* express-rate-limit
* express-validator
* dotenv

---

# Environment Variables

Create a `.env` file in the project root.

Example:

```
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
PORT=3000
```

---

# Running the Project

Start the server using:

```
node server.js
```

Or if using npm scripts:

```
npm start
```

Server will start at:

```
http://localhost:3000
```

---

# How to Test the Application

Open the homepage:

```
http://localhost:3000
```

Available features:

### Authentication

```
/login
/register
```

### Course Management

```
/courses.html
```

### File Upload

```
/upload.html
```

### Download Materials

```
/materials/<filename>.pdf
```

### Real-Time Chat

```
/chat.html
```

---

# Demonstrated Backend Concepts

This project demonstrates:

* REST API design
* API versioning
* Middleware architecture
* Input validation
* Rate limiting
* Error handling
* File uploads
* Static file serving
* WebSocket communication
* Session authentication

---

