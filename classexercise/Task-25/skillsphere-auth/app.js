require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const session = require("express-session")
const passport = require("passport")
const multer = require("multer")
const path = require("path")
const compression = require("compression")

const courseRoutes = require("./routes/courses")
const limiter = require("./middleware/rateLimiter")
const errorHandler = require("./middleware/errorHandler")
const userRoutes = require("./routes/users")

require("./config/passport")(passport)

const authRoutes = require("./routes/auth")

const app = express()

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected Successfully!"))

// Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/")
    },
    filename: function (req, file, cb) {
        const sanitizedName = Date.now() + "-" + file.originalname
        cb(null, sanitizedName)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (path.extname(file.originalname) !== ".pdf") {
            return cb(new Error("Only PDF files are allowed"))
        }
        cb(null, true)
    }
})

// View engine
app.set("view engine","ejs")

// Global middleware
app.use(compression())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())

// Static files
app.use(express.static("public"))
app.use("/materials", express.static("uploads"))

// Session middleware
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.get("/", (req, res) => {
    res.render("home")
})

app.get("/status", (req, res) => {
    res.send("App is live")
})

app.use("/",authRoutes)

app.use("/api/v1/courses", limiter, courseRoutes)

app.use("/api/users", userRoutes)

app.post("/upload", upload.single("file"), (req, res) => {
    res.json({
        message: `File uploaded successfully: ${req.file.filename}`
    })
})

// Error handler (always last)
app.use(errorHandler)

module.exports = app