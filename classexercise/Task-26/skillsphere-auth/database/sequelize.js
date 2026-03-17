// database/sequelize.js

const { Sequelize } = require("sequelize")

const sequelize = new Sequelize("skillsphere", "root", "ArijitDas@2003$56", {
  host: "localhost",
  dialect: "mysql"
})

module.exports = sequelize