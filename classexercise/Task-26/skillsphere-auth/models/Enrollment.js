const mongoose = require("mongoose")

const enrollmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    courseName: {
        type: String,
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Enrollment", enrollmentSchema)