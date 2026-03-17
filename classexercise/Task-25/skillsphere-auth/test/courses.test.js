const chai = require("chai")
const expect = chai.expect

describe("Courses API Unit Tests", () => {

    it("should create a course object", () => {
        const course = {
            name: "Node.js",
            duration: "4 weeks"
        }

        expect(course).to.have.property("name")
        expect(course).to.have.property("duration")
    })

    it("should validate course name", () => {
        const course = { duration: "4 weeks" }

        expect(course.name).to.be.undefined
    })

})