const express = require("express")
const router = express.Router()

const courses = [
    { id: 1, name: "JavaScript Basics" },
    { id: 2, name: "Node.js Fundamentals" },
    { id: 3, name: "MongoDB Essentials" }
]

router.get("/", (req, res) => {

    res.render("courses", { courses })

})

module.exports = router