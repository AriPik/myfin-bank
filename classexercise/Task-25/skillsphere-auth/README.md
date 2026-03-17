# SkillSphere-Auth API

A RESTful API built with Node.js, Express, and MongoDB for managing courses, users, authentication, and file uploads.  
This project demonstrates backend development concepts including RESTful routing, middleware usage, authentication, file uploads, testing, and deployment readiness.

---

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- Passport.js (Authentication)
- Express Session
- Multer (File Uploads)
- Rate Limiting Middleware
- Compression Middleware
- Mocha, Chai, SuperTest (API Testing)
- Nodemon (Development)

---

## Project Structure

```
project-root/
│
├── app.js                 # Main Express app configuration
├── server.js              # Entry point to start the server
├── config/
│   └── passport.js        # Passport authentication configuration
│
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── users.js           # User-related routes
│   └── courses.js         # Course-related API routes
│
├── middleware/
│   ├── rateLimiter.js     # API rate limiting middleware
│   └── errorHandler.js    # Global error handler
│
├── public/                # Static files
├── uploads/               # Uploaded PDF files
├── test/                  # API test files
│
├── package.json
└── README.md
```

---

## Installation

1. Clone the repository

```
git clone <repository-url>
cd <project-folder>
```

2. Install dependencies

```
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory.

Example:

```
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
PORT=3000
```

---

## Running the Application

The server is started using **server.js**.

Run the application using:

```
npx nodemon server.js
```

or

```
npm start
```

Server will run at:

```
http://localhost:3000
```

Health check endpoint:

```
GET /status
```

---

## API Testing

Automated tests are implemented using:

- Mocha
- Chai
- SuperTest

Run tests using:

```
npm test
```

---

## File Upload

File uploads are handled using **Multer**.

Endpoint:

```
POST /upload
```

Requirements:

- Only **PDF files** are allowed
- Uploaded files are stored in the `uploads/` directory

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

## Example API Endpoints

```
GET /status
POST /api/users
POST /api/v1/courses
POST /upload
```

---

## Important Notes

- The main Express application configuration is located in app.js.
- server.js is used only to start the server.
- API routes are organized using Express Router.
- Rate limiting middleware is applied to course routes.
- Global error handling middleware is implemented.
- Compression middleware is used to optimize responses.

### Refactoring Update

The **Manage Courses frontend functionality** was removed during refactoring:
- The related frontend file inside the `public/` directory was deleted.
- Associated routes were also removed from `app.js`.

The backend API functionality for courses remains available.

---

## Project Features

- RESTful API structure
- MongoDB database integration
- Authentication using Passport.js
- File uploads with validation
- Middleware usage (rate limiting, compression, error handling)
- Automated API testing
- Environment variable configuration
- Modular route architecture

---

## Status

The application includes a status endpoint to verify the server is running:

```
GET /status
```

Response:

```
App is live
```

---

Project created as part of backend development practice focusing on REST APIs, middleware, testing, and deployment concepts.