const express = require("express")
const path = require("path")

const logger = require("./middleware/logger")

const courseRoutes = require("./routes/courses")
const userRoutes = require("./routes/users")

const app = express()

// Built-in middleware (Challenge 2)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))



// Logging middleware (Challenge 1)

app.use(logger)

// View engine setup (Challenge 3)

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// Routes

app.use("/courses", courseRoutes)
app.use("/users", userRoutes)

const PORT = 3000

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`)

})