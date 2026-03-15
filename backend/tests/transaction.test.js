const chai = require("chai");
const supertest = require("supertest");
const app = require("../server");
const {
  getCustomerToken,
  getAdminToken,
} = require("./helpers/auth.helper");

const { expect } = chai;
const request = supertest(app);

let customerToken;
let adminToken;

before(async () => {
  customerToken = await getCustomerToken();
  adminToken = await getAdminToken();
});

describe("Transaction APIs", () => {
  describe("POST /api/transactions/deposit", () => {
    it("should deposit successfully", async () => {
      const res = await request
        .post("/api/transactions/deposit")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          accountNumber: "MYFIN-SACC-0001",
          amount: 1000,
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("message");
      expect(res.body).to.have.property("transaction");
      expect(res.body.message).to.equal("Deposit successful");
    });

    it("should fail without token", async () => {
      const res = await request
        .post("/api/transactions/deposit")
        .send({
          accountNumber: "MYFIN-SACC-0001",
          amount: 1000,
        });

      expect(res.status).to.equal(401);
    });

    it("should fail if amount is zero", async () => {
      const res = await request
        .post("/api/transactions/deposit")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          accountNumber: "MYFIN-SACC-0001",
          amount: 0,
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message");
    });

    it("should fail if account not found", async () => {
      const res = await request
        .post("/api/transactions/deposit")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          accountNumber: "MYFIN-SACC-9999",
          amount: 1000,
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Account not found");
    });
  });

  describe("POST /api/transactions/withdraw", () => {
    it("should withdraw successfully", async () => {
      const res = await request
        .post("/api/transactions/withdraw")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          accountNumber: "MYFIN-SACC-0001",
          amount: 500,
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("message");
      expect(res.body.message).to.equal("Withdrawal successful");
    });

    it("should fail if insufficient balance", async () => {
      const res = await request
        .post("/api/transactions/withdraw")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          accountNumber: "MYFIN-SACC-0001",
          amount: 999999,
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Insufficient balance");
    });

    it("should fail without token", async () => {
      const res = await request
        .post("/api/transactions/withdraw")
        .send({
          accountNumber: "MYFIN-SACC-0001",
          amount: 500,
        });

      expect(res.status).to.equal(401);
    });
  });

  describe("POST /api/transactions/transfer", () => {
    it("should transfer successfully", async () => {
      const res = await request
        .post("/api/transactions/transfer")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          senderAccountNumber: "MYFIN-SACC-0001",
          receiverAccountNumber: "MYFIN-SACC-0003",
          amount: 100,
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("message");
      expect(res.body.message).to.equal("Transfer successful");
      expect(res.body).to.have.property("debitTransaction");
      expect(res.body).to.have.property("creditTransaction");
    });

    it("should fail if sender and receiver are same", async () => {
      const res = await request
        .post("/api/transactions/transfer")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          senderAccountNumber: "MYFIN-SACC-0001",
          receiverAccountNumber: "MYFIN-SACC-0001",
          amount: 100,
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal(
        "Sender and receiver account cannot be same"
      );
    });

    it("should fail without token", async () => {
      const res = await request
        .post("/api/transactions/transfer")
        .send({
          senderAccountNumber: "MYFIN-SACC-0001",
          receiverAccountNumber: "MYFIN-SACC-0003",
          amount: 100,
        });

      expect(res.status).to.equal(401);
    });
  });

  describe("GET /api/transactions/passbook/:accountNumber", () => {
    it("should return passbook for customer", async () => {
      const res = await request
        .get("/api/transactions/passbook/MYFIN-SACC-0001")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("transactions");
      expect(res.body.transactions).to.be.an("array");
    });

    it("should fail without token", async () => {
      const res = await request
        .get("/api/transactions/passbook/MYFIN-SACC-0001");

      expect(res.status).to.equal(401);
    });

    it("should fail if customer accesses another account", async () => {
      const rahulRes = await request
        .post("/api/auth/customer/login")
        .send({
          identifier: "rahul@gmail.com",
          password: "password123",
        });

      const rahulToken = rahulRes.body.token;

      const res = await request
        .get("/api/transactions/passbook/MYFIN-SACC-0001")
        .set("Authorization", `Bearer ${rahulToken}`);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal(
        "Unauthorized access to this account"
      );
    });
  });
});