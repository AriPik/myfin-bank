const { DataTypes } = require("sequelize")
const sequelize = require("../database/sequelize")

const Instructor = sequelize.define("Instructor", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

module.exports = Instructor