require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const session = require("express-session")
const passport = require("passport")
const multer = require("multer")
const path = require("path")


const courseRoutes = require("./routes/courses")
const limiter = require("./middleware/rateLimiter")
const errorHandler = require("./middleware/errorHandler")

require("./config/passport")(passport)

const authRoutes = require("./routes/auth")

const app = express()

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected Successfully!"))

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

app.set("view engine","ejs")

app.use(express.static("public"))
app.use("/materials", express.static("uploads"))

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())
app.get("/", (req, res) => {
    res.render("home")
})

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use("/",authRoutes)
app.use("/api/v1/courses", limiter, courseRoutes)

app.post("/upload", upload.single("file"), (req, res) => {
    res.json({
        message: `File uploaded successfully: ${req.file.filename}`
    })
})

app.use(errorHandler)
module.exports=app
// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });
