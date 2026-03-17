const express = require("express");
const router = express.Router();
const db = require("../database/mysql");

router.post("/add-course", (req, res) => {

  const course = {
    title: "Node API Development",
    instructor: "Admin"
  };

  db.query(
    "INSERT INTO courses SET ?",
    course,
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Insert failed");
      }

      console.log("INSERT INTO courses successful");
      res.send("Course inserted successfully");
    }
  );
});

module.exports = router;