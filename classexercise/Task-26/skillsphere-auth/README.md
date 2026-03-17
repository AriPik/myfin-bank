# SkillSphere Backend API

A RESTful backend API built with Node.js and Express for managing courses, users, authentication, and file uploads.
The project demonstrates integration with **MongoDB**, **MySQL**, and **Sequelize ORM**, along with middleware usage, authentication, testing, and modular API design.

This project was developed to practice **backend architecture, database connectivity, and REST API development**.

---

# Technologies Used

* Node.js
* Express.js
* MongoDB with Mongoose
* MySQL
* Sequelize ORM
* Passport.js (Authentication)
* Express Session
* Multer (File Uploads)
* Compression Middleware
* Rate Limiting Middleware
* Mocha, Chai, SuperTest (API Testing)
* Nodemon (Development)

---

# Project Structure

```
project-root/
│
├── app.js                    # Express application configuration
├── server.js                 # Server entry point
│
├── database/
│   ├── mongo.js              # MongoDB connection
│   ├── mysql.js              # MySQL connection
│   └── sequelize.js          # Sequelize ORM configuration
│
├── models/
│   ├── Course.js             # Sequelize Course model
│   └── Instructor.js         # Sequelize Instructor model
│
├── routes/
│   ├── auth.js               # Authentication routes
│   ├── users.js              # User routes
│   └── courses.js            # Course API routes
│
├── middleware/
│   ├── rateLimiter.js        # API rate limiting middleware
│   └── errorHandler.js       # Global error handler
│
├── public/                   # Static files
├── uploads/                  # Uploaded files
├── test/                     # API tests
│
├── package.json
└── README.md
```

---

# Installation

Clone the repository:

```
git clone <repository-url>
cd <project-folder>
```

Install dependencies:

```
npm install
```

---

# Environment Variables

Create a `.env` file in the root directory.

Example configuration:

```
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
PORT=5000
```

---

# Running the Application

The server starts using **server.js**.

Start the development server:

```
npx nodemon server.js
```

or

```
npm start
```

Server runs at:

```
http://localhost:5000
```

Health check endpoint:

```
GET /status
```

---

# Database Integration

The application demonstrates connectivity with multiple databases:

### MongoDB

Used for document-based data storage using **Mongoose**.

### MySQL

Used for relational data queries via the MySQL driver.

### Sequelize ORM

Used to define relational models and automatically sync tables.

When the server starts, Sequelize synchronizes models and creates tables if they do not exist.

---

# File Uploads

File uploads are handled using **Multer**.

Endpoint:

```
POST /upload
```

Rules:

* Only **PDF files** are allowed
* Files are stored in the `uploads/` directory

Example response:

```
{
  "message": "File uploaded successfully: filename.pdf"
}
```

Uploaded files can be accessed via:

```
/materials/<filename>
```

---

# Example API Endpoints

```
GET /status
POST /api/users
POST /api/courses
POST /upload
```

---

# API Testing

Automated API tests are implemented using:

* Mocha
* Chai
* SuperTest

Run tests using:

```
npm test
```

---

# Middleware Features

The project demonstrates several middleware implementations:

* Rate limiting for API protection
* Compression for optimized responses
* Global error handling
* Authentication middleware
* File upload validation

---

# Refactoring Notes

During refactoring, the **Manage Courses frontend functionality** was removed.

Changes included:

* Deletion of the related frontend file inside the `public/` directory
* Removal of associated frontend routes

The backend API for course management remains available.

---

# Project Features

* RESTful API architecture
* MongoDB database integration
* MySQL database connectivity
* Sequelize ORM models and table synchronization
* Authentication using Passport.js
* File uploads with validation
* Middleware implementation
* Automated API testing
* Environment variable configuration
* Modular backend structure

---

# Status Endpoint

The application includes a status endpoint to verify the server is running.

```
GET /status
```

Example response:

```
App is live
```

---

# Project Purpose

This project was created as part of backend development practice to demonstrate:

* REST API design
* Database integration
* Middleware usage
* Authentication
* File handling
* Automated testing
* Clean project architecture
