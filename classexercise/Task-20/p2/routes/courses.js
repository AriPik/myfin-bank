const express = require("express");
const router = express.Router();

// Route-level middleware (Challenge 3)
function validateCourseId(req, res, next) {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({
            error: "Invalid course ID"
        });
    }

    next();
}

// Challenge 2: Dynamic Route
router.get("/:id", validateCourseId, (req, res) => {
    const { id } = req.params;

    res.json({
        id: id,
        name: "React Mastery",
        duration: "6 weeks"
    });
});

module.exports = router;