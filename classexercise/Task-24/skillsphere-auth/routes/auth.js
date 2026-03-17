const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const passport = require("passport")
const User = require("../models/User")
const {ensureAuthenticated,ensureAdmin} = require("../middleware/auth")

router.get("/register",(req,res)=>{
    res.render("register",{message:null})
})

router.post("/register", async(req,res)=>{

    const {name,email,password} = req.body

    const hashedPassword = await bcrypt.hash(password,10)

    const user = new User({
        name,
        email,
        password:hashedPassword
    })

    await user.save()

    console.log("User saved to database")

    res.render("register",{message:`Registration successful for ${name}`})
})

router.get("/login",(req,res)=>{
    res.render("login",{message:null})
})

router.post("/login", (req, res, next) => {

    passport.authenticate("local", (err, user, info) => {

        if (err) return next(err)

        if (!user) {
            return res.render("login", { message: info.message || "Invalid email or password" })
        }

        req.logIn(user, (err) => {

            if (err) return next(err)

            return res.render("login", { message: `Login successful for ${user.name}` })
        })

    })(req, res, next)

})

router.get("/admin", ensureAuthenticated, ensureAdmin, (req,res)=>{
    res.send("Welcome, Admin!")
})

module.exports = router