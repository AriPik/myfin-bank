const express = require("express");

const app = express();
const PORT = 4000;

app.use(express.json());

// Import course routes
const courseRoutes = require("./routes/courses");

// Mount routes
app.use("/courses", courseRoutes);

// Root Route (Challenge 1)
app.get("/", (req, res) => {
    res.json({ message: "Welcome to SkillSphere LMS API" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});