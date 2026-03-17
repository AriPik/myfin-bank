const request = require("supertest")
const app = require("../app")
const chai = require("chai")
const expect = chai.expect

describe("User Routes Integration Test", () => {

    it("should return login page", async () => {
        const res = await request(app).get("/login")

        expect(res.status).to.equal(200)
    })

    it("should return register page", async () => {
        const res = await request(app).get("/register")

        expect(res.status).to.equal(200)
    })

})