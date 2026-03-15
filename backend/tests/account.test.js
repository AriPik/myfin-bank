
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

describe("Account APIs", () => {
  describe("POST /api/accounts/request", () => {
    it("should fail without token", async () => {
      const res = await request
        .post("/api/accounts/request")
        .send({ accountType: "SAVINGS" });

      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal(
        "Access denied. No token provided."
      );
    });

    it("should fail if customer already has savings account", async () => {
      const res = await request
        .post("/api/accounts/request")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({ accountType: "SAVINGS" });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message");
    });

    it("should fail if accountType is missing", async () => {
      const res = await request
        .post("/api/accounts/request")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({});

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message");
    });
  });

  describe("GET /api/accounts/my-accounts", () => {
    it("should return customer accounts", async () => {
      const res = await request
        .get("/api/accounts/my-accounts")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("accounts");
      expect(res.body.accounts).to.be.an("array");
    });

    it("should fail without token", async () => {
      const res = await request
        .get("/api/accounts/my-accounts");

      expect(res.status).to.equal(401);
    });
  });

  describe("GET /api/accounts/all", () => {
    it("should return all accounts for admin", async () => {
      const res = await request
        .get("/api/accounts/all")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("accounts");
      expect(res.body.accounts).to.be.an("array");
    });

    it("should fail for customer token", async () => {
      const res = await request
        .get("/api/accounts/all")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).to.equal(403);
      expect(res.body.message).to.equal(
        "Access denied. You do not have permission."
      );
    });
  });
});