require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./connection");
const customerAuthRoutes = require("./routes/auth.customer.routes");
const adminAuthRoutes = require("./routes/auth.admin.routes");
const accountRoutes = require("./routes/account.routes");
const transactionRoutes = require("./routes/transaction.routes");
const loanRoutes = require("./routes/loan.routes");
const fixedDepositRoutes = require("./routes/fixedDeposit.routes");
const recurringDepositRoutes = require("./routes/recurringDeposit.routes");
const beneficiaryRoutes = require("./routes/beneficiary.routes");
const supportRoutes = require("./routes/support.routes");
const adminRoutes = require("./routes/admin.routes");
const { startAtRiskCron, startEMICron, startBeneficiaryApprovalCron } = require("./utils/cron");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

connectDB();

const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use("/backend/uploads", express.static("backend/uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/auth/customer", customerAuthRoutes);
app.use("/api/auth/admin", adminAuthRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/fd", fixedDepositRoutes);
app.use("/api/rd", recurringDepositRoutes);
app.use("/api/beneficiaries", beneficiaryRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "MyFin Bank API is running!" });
});

io.on("connection", (socket) => {
  socket.on("join_ticket", (ticketId) => {
    socket.join(ticketId);
  });

  socket.on("leave_ticket", (ticketId) => {
    socket.leave(ticketId);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  startAtRiskCron();
  startEMICron();
  startBeneficiaryApprovalCron();
});

module.exports = app;
