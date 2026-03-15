const cron = require("node-cron");
const Account = require("../models/account.model");
const Beneficiary = require("../models/beneficiary.model");
const Customer = require("../models/customer.model");
const Loan = require("../models/loan.model");
const { processEMI } = require("../services/loan.service");
const {
  sendAutoDeactivationAlert,
} = require("../utils/mailer");

const startAtRiskCron = () => {
  // Runs every 1 hour
  cron.schedule("0 * * * *", async () => {
    const twentyFourHoursAgo = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    );

    const atRiskAccounts = await Account.find({
      status: "AT_RISK",
      atRiskSince: { $lte: twentyFourHoursAgo },
    });

    for (const account of atRiskAccounts) {
      await Account.findOneAndUpdate(
        { accountNumber: account.accountNumber },
        {
          status: "DEACTIVATED",
          deactivationType: "AUTO",
        }
      );

      const customer = await Customer.findOne({
        customerId: account.customerId,
      });

      await sendAutoDeactivationAlert(
        customer.name,
        account.accountNumber,
        customer.email
      );
    }
  });
};

const startEMICron = () => {
  // Runs at 9AM on 1st of every month
  cron.schedule("0 9 1 * *", async () => {
    const activeLoans = await Loan.find({ status: "ACTIVE" });

    for (const loan of activeLoans) {
      try {
        await processEMI(loan.loanId);
      } catch (error) {
        // If insufficient balance skip silently
        // Will be retried next month
      }
    }
  });
};

const startBeneficiaryApprovalCron = () => {
  cron.schedule("* * * * *", async () => {
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
    const pendingBeneficiaries = await Beneficiary.find({
      status: "PENDING",
      createdAt: { $lte: thirtyMinsAgo },
    });
    for (const ben of pendingBeneficiaries) {
      await Beneficiary.findOneAndUpdate(
        { beneficiaryId: ben.beneficiaryId },
        { status: "ACTIVE" }
      );
    }
  });
};

module.exports = { startAtRiskCron, startEMICron, startBeneficiaryApprovalCron };
