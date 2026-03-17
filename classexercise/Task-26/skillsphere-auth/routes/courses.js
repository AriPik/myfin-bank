const express = require("express")
const router = express.Router()
const courses = require("../data/courses")

const { body, validationResult } = require("express-validator")
const CourseModel = require("../models/Course")
const Instructor = require("../models/Instructor")
// GET all courses
router.get("/", (req,res)=>{
    res.json(courses)
})

// POST new course (with validation)
router.post("/",
[
    body("name").notEmpty().withMessage("Course name is required"),
    body("duration").notEmpty().withMessage("Course duration is required")
],
(req,res,next)=>{

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()[0].msg})
    }

    const newCourse = {
        id: courses.length + 1,
        name: req.body.name,
        duration: req.body.duration
    }

    courses.push(newCourse)

    res.status(201).json(newCourse)
})

// PUT update course
router.put("/:id",(req,res)=>{

    const course = courses.find(c=>c.id==req.params.id)

    if(!course){
        return res.status(404).json({error:"Course not found"})
    }

    course.name = req.body.name || course.name
    course.duration = req.body.duration || course.duration

    res.json(course)
})

// DELETE course
router.delete("/:id",(req,res)=>{

    const index = courses.findIndex(c=>c.id==req.params.id)

    if(index === -1){
        return res.status(404).json({error:"Course not found"})
    }

    courses.splice(index,1)

    res.json({message:"Course deleted"})
})
// GET courses by instructor (Sequelize)
router.get("/instructor/:id", async (req, res) => {

    try {

        const courses = await CourseModel.findAll({
            where: { InstructorId: req.params.id },
            include: Instructor
        })

        res.json(courses)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})
module.exports = router