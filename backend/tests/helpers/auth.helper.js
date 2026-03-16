const supertest = require("supertest");
const app = require("../../server");

const request = supertest(app);

const getCustomerToken = async () => {
  const res = await request
    .post("/api/auth/customer/login")
    .send({
      identifier: "MYFIN-CUST-0001",
      password: "modernnewpass123",
    });
  return res.body.token;
};

const getAdminToken = async () => {
  const res = await request
    .post("/api/auth/admin/login")
    .send({
      identifier: "myfinbank.admin@gmail.com",
      password: "Admin@MyFinBank@123",
    });
  return res.body.token;
};

module.exports = { getCustomerToken, getAdminToken };