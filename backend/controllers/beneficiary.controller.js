const {
  addBeneficiary,
  getMyBeneficiaries,
  getAllBeneficiaries,
  approveBeneficiary,
  rejectBeneficiary,
} = require("../services/beneficiary.service");

const addBeneficiaryHandler = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { beneficiaryName, accountNumber, branch } = req.body;

    if (!beneficiaryName || !accountNumber || !branch) {
      return res.status(400).json({
        message:
          "Beneficiary name, account number and branch are required",
      });
    }

    const beneficiary = await addBeneficiary(customerId, req.body);
    res.status(201).json({
      message:
        "Beneficiary added successfully. Awaiting admin approval.",
      beneficiary,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyBeneficiariesHandler = async (req, res) => {
  try {
    const customerId = req.user.id;
    const beneficiaries = await getMyBeneficiaries(customerId);
    res.status(200).json({ beneficiaries });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllBeneficiariesHandler = async (req, res) => {
  try {
    const beneficiaries = await getAllBeneficiaries();
    res.status(200).json({ beneficiaries });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const approveBeneficiaryHandler = async (req, res) => {
  try {
    const { beneficiaryId } = req.params;
    const beneficiary = await approveBeneficiary(beneficiaryId);
    res.status(200).json({
      message: "Beneficiary approved successfully",
      beneficiary,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const rejectBeneficiaryHandler = async (req, res) => {
  try {
    const { beneficiaryId } = req.params;
    const beneficiary = await rejectBeneficiary(beneficiaryId);
    res.status(200).json({
      message: "Beneficiary rejected",
      beneficiary,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addBeneficiaryHandler,
  getMyBeneficiariesHandler,
  getAllBeneficiariesHandler,
  approveBeneficiaryHandler,
  rejectBeneficiaryHandler,
};