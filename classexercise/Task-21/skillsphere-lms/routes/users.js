const express = require("express")
const router = express.Router()

router.post("/", (req, res) => {

    const userData = req.body

    res.json({
        message: "User created successfully",
        data: userData
    })

})

module.exports = router