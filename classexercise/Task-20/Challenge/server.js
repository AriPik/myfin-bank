const express = require("express");

const app = express();
const PORT = 4000;

// =====================
// Global Middleware
// =====================

// Logger
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${req.method}] ${req.url}`);
    next();
});

// JSON body parser
app.use(express.json());

// =====================
// Routes
// =====================

const bookRouter = require("./routes/books");

app.use("/books", bookRouter);

// =====================
// 404 Handler
// =====================
app.use((req, res, next) => {
    res.status(404).json({
        error: "Route not found"
    });
});

// =====================
// Global Error Handler
// =====================
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        error: "Internal Server Error"
    });
});

// =====================
// Start Server
// =====================
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});