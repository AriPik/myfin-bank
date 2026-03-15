const Beneficiary = require("../models/beneficiary.model");
const generateId = require("../utils/idGenerator");
const Account = require("../models/account.model");
const addBeneficiary = async (customerId, data) => {
  // Check if account belongs to the same customer
  const ownAccount = await Account.findOne({
    accountNumber: data.accountNumber,
    customerId,
  });

  if (ownAccount) {
    throw new Error(
      "You cannot add your own account as a beneficiary"
    );
  }

  // Check if same account number already added by this customer
  const existing = await Beneficiary.findOne({
    customerId,
    accountNumber: data.accountNumber,
    status: { $ne: "REJECTED" },
  });

  if (existing) {
    throw new Error(
      "This account is already added as a beneficiary"
    );
  }

  const count = await Beneficiary.countDocuments();
  const beneficiaryId = generateId("BEN", count + 1);

  // const beneficiary = await Beneficiary.create({
  //   beneficiaryId,
  //   customerId,
  //   beneficiaryName: data.beneficiaryName,
  //   accountNumber: data.accountNumber,
  //   branch: data.branch,
  //   status: "PENDING",
  // });

  // return beneficiary;

  const accountExists = await Account.findOne({
    accountNumber: data.accountNumber,
    status: "ACTIVE",
  });

  if (!accountExists) {
    throw new Error(
      "Account number not found in our system. Please check and try again."
    );
  }

  const beneficiary = await Beneficiary.create({
    beneficiaryId,
    customerId,
    beneficiaryName: data.beneficiaryName,
    accountNumber: data.accountNumber,
    branch: data.branch,
    status: "PENDING",
  });

  return beneficiary;
};

const getMyBeneficiaries = async (customerId) => {
  const beneficiaries = await Beneficiary.find({ customerId });
  return beneficiaries;
};

const getAllBeneficiaries = async () => {
  const beneficiaries = await Beneficiary.find({});
  return beneficiaries;
};

const approveBeneficiary = async (beneficiaryId) => {
  const beneficiary = await Beneficiary.findOne({ beneficiaryId });

  if (!beneficiary) {
    throw new Error("Beneficiary not found");
  }

  if (beneficiary.status !== "PENDING") {
    throw new Error("Only pending beneficiaries can be approved");
  }

  const updated = await Beneficiary.findOneAndUpdate(
    { beneficiaryId },
    { status: "ACTIVE" },
    { new: true }
  );

  return updated;
};

const rejectBeneficiary = async (beneficiaryId) => {
  const beneficiary = await Beneficiary.findOne({ beneficiaryId });

  if (!beneficiary) {
    throw new Error("Beneficiary not found");
  }

  if (beneficiary.status !== "PENDING") {
    throw new Error("Only pending beneficiaries can be rejected");
  }

  const updated = await Beneficiary.findOneAndUpdate(
    { beneficiaryId },
    { status: "REJECTED" },
    { new: true }
  );

  return updated;
};

module.exports = {
  addBeneficiary,
  getMyBeneficiaries,
  getAllBeneficiaries,
  approveBeneficiary,
  rejectBeneficiary,
};