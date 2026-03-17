const express = require("express")
const router = express.Router()
const Enrollment = require("../models/Enrollment")

router.get("/", async (req, res) => {
    try {
        const enrollments = await Enrollment.find().populate("userId")
        res.json(enrollments)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post("/add", async (req, res) => {
    try {

        const enrollment = new Enrollment({
            userId: "65f000000000000000000000",
            courseName: "Node.js Masterclass"
        })

        await enrollment.save()

        res.json({ message: "Enrollment added" })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})
module.exports = router