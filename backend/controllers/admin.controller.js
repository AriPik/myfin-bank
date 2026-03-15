const {
  getAllCustomers,
  getCustomerById,
  activateCustomer,
  rejectCustomer,
  getReportsSummary,
} = require("../services/admin.service");

const getAllCustomersHandler = async (req, res) => {
  try {
    const customers = await getAllCustomers();
    res.status(200).json({ customers });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCustomerByIdHandler = async (req, res) => {
  try {
    const { customerId } = req.params;
    const data = await getCustomerById(customerId);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const activateCustomerHandler = async (req, res) => {
  try {
    const { customerId } = req.params;
    const customer = await activateCustomer(customerId);
    res.status(200).json({
      message: "Customer activated successfully",
      customer,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const rejectCustomerHandler = async (req, res) => {
  try {
    const { customerId } = req.params;
    const customer = await rejectCustomer(customerId);
    res.status(200).json({
      message: "Customer rejected",
      customer,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getReportsSummaryHandler = async (req, res) => {
  try {
    const summary = await getReportsSummary();
    res.status(200).json({ summary });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllCustomersHandler,
  getCustomerByIdHandler,
  activateCustomerHandler,
  rejectCustomerHandler,
  getReportsSummaryHandler,
};