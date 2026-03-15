const chai = require("chai");
const supertest = require("supertest");
const app = require("../server");

const { expect } = chai;
const request = supertest(app);

let testEmail = `testcustomer${Date.now()}@gmail.com`;

describe("Customer Auth APIs", () => {
  describe("POST /api/auth/customer/register", () => {
    it("should register a new customer successfully", async () => {
      const res = await request
        .post("/api/auth/customer/register")
        .send({
          name: "Test Customer",
          email: testEmail,
          password: "test123",
          phone: "9000000001",
          address: "Test Address",
          govIdType: "PAN",
          govIdNumber: `TEST${Date.now()}`,
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("message");
      expect(res.body).to.have.property("customerId");
      expect(res.body.message).to.equal(
        "Registration successful. Awaiting KYC verification."
      );
    });

    it("should fail if email already exists", async () => {
      const res = await request
        .post("/api/auth/customer/register")
        .send({
          name: "Test Customer",
          email: testEmail,
          password: "test123",
          phone: "9000000002",
          address: "Test Address",
          govIdType: "PAN",
          govIdNumber: `TEST${Date.now()}`,
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message");
    });

    it("should fail if required fields are missing", async () => {
      const res = await request
        .post("/api/auth/customer/register")
        .send({
          name: "Test Customer",
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message");
    });
  });

  describe("POST /api/auth/customer/login", () => {
    it("should fail login if account is pending verification", async () => {
      const res = await request
        .post("/api/auth/customer/login")
        .send({
          identifier: testEmail,
          password: "test123",
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal(
        "Account pending KYC verification"
      );
    });

    it("should login successfully with email", async () => {
      const res = await request
        .post("/api/auth/customer/login")
        .send({
          identifier: "arijitdas7996@gmail.com",
          password: "modernnewpass123",
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("token");
      expect(res.body).to.have.property("customer");
      expect(res.body.message).to.equal("Login successful");
    });

    it("should login successfully with customerId", async () => {
      const res = await request
        .post("/api/auth/customer/login")
        .send({
          identifier: "MYFIN-CUST-0001",
          password: "modernnewpass123",
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("token");
    });

    it("should fail with wrong password", async () => {
      const res = await request
        .post("/api/auth/customer/login")
        .send({
          identifier: "arijitdas7996@gmail.com",
          password: "wrongpassword",
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid credentials");
    });

    it("should fail with missing fields", async () => {
      const res = await request
        .post("/api/auth/customer/login")
        .send({});

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message");
    });
  });

  describe("POST /api/auth/customer/forgot-password", () => {
    it("should send OTP successfully", async () => {
      const res = await request
        .post("/api/auth/customer/forgot-password")
        .send({
          identifier: "arijitdas7996@gmail.com",
        });

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal(
        "OTP sent successfully to registered email"
      );
    });

    it("should fail if identifier not found", async () => {
      const res = await request
        .post("/api/auth/customer/forgot-password")
        .send({
          identifier: "notexist@gmail.com",
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message");
    });
  });
});
