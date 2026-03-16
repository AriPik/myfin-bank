const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (
  customerName,
  customerEmail,
  customerId
) => {
  const mailOptions = {
    from: `"MyFin Bank" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `🎉 Welcome to MyFin Bank — Account Approved!`,
    html: `
      <h2>Welcome to MyFin Bank! 🏦</h2>
      <p>Dear ${customerName},</p>
      <p>Congratulations! Your MyFin Bank account has been 
         successfully verified and approved.</p>
      <p>You can now login and start banking with us!</p>
      <br/>
      <h3>Your Login Credentials:</h3>
      <p><strong>Customer ID:</strong> ${customerId}</p>
      <p>Use your <strong>registered password</strong> to login.</p>
      <br/>
      <p>You can login using either your 
         <strong>Email ID</strong> or 
         <strong>Customer ID</strong>.</p>
      <p>For security purposes, we recommend 
         changing your password after first login.</p>
      <br/>
      <p>Welcome aboard! 🎉</p>
      <p>MyFin Bank — Customer Support Team</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const sendZeroBalanceAlert = async (customerName, accountNumber) => {
  const mailOptions = {
    from: `"MyFin Bank" <${process.env.ADMIN_EMAIL}>`,
    to: process.env.EMAIL_USER,
    subject: `⚠️ Zero Balance Alert — ${accountNumber}`,
    html: `
      <h2>Zero Balance Alert</h2>
      <p>This is an automated alert from MyFin Bank.</p>
      <p><strong>Customer Name:</strong> ${customerName}</p>
      <p><strong>Account Number:</strong> ${accountNumber}</p>
      <p>The above savings account balance has dropped to zero.</p>
      <p>Account status has been changed to <strong>AT_RISK</strong>.</p>
      <p>If no deposit is made within 24 hours, 
         the account will be automatically deactivated
         to prevent account deactivation.</p>
      <br/>
      <p>MyFin Bank — Automated Notification System</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const sendOverdraftAlert = async (customerName, accountNumber, customerEmail, overdraftLimit) => {
  const adminMailOptions = {
    from: `"MyFin Bank" <${process.env.ADMIN_EMAIL}>`,
    to: process.env.EMAIL_USER,
    subject: `⚠️ Overdraft Limit Reached — ${accountNumber}`,
    html: `
      <h2>Overdraft Limit Alert</h2>
      <p>This is an automated alert from MyFin Bank.</p>
      <p><strong>Customer Name:</strong> ${customerName}</p>
      <p><strong>Account Number:</strong> ${accountNumber}</p>
      <p>The above current account has reached its overdraft 
         limit of <strong>₹${overdraftLimit}</strong>.</p>
      <p>Account status has been changed to <strong>AT_RISK</strong>.</p>
      <p>Customer must deposit funds to prevent account deactivation.</p>
      <br/>
      <p>MyFin Bank — Automated Notification System</p>
    `,
  };

  const customerMailOptions = {
    from: `"MyFin Bank" <${process.env.ADMIN_EMAIL}>`,
    to: customerEmail,
    subject: `⚠️ Overdraft Limit Reached — ${accountNumber}`,
    html: `
      <h2>Overdraft Limit Reached</h2>
      <p>Dear ${customerName},</p>
      <p>Your current account <strong>${accountNumber}</strong> 
         has reached its overdraft limit of 
         <strong>₹${overdraftLimit}</strong>.</p>
      <p>Please deposit funds immediately to settle 
         your overdraft and prevent account deactivation.</p>
      <br/>
      <p>MyFin Bank — Automated Notification System</p>
    `,
  };

  await transporter.sendMail(adminMailOptions);
  await transporter.sendMail(customerMailOptions);
};

const sendAccountRecoveryAlert = async (customerName, accountNumber, customerEmail) => {
  const mailOptions = {
    from: `"MyFin Bank" <${process.env.ADMIN_EMAIL}>`,
    to: customerEmail,
    subject: `✅ Account Recovered — ${accountNumber}`,
    html: `
      <h2>Account Status Recovered</h2>
      <p>Dear ${customerName},</p>
      <p>Your account has been successfully recovered.</p>
      <p><strong>Account Number:</strong> ${accountNumber}</p>
      <p>Your account status has been changed back to 
         <strong>ACTIVE</strong>.</p>
      <p>You can now perform transactions normally.</p>
      <br/>
      <p>Thank you for banking with MyFin Bank! 🏦</p>
      <p>MyFin Bank — Automated Notification System</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const sendLoanSettledAlert = async (customerName, loanId, accountNumber) => {
  const mailOptions = {
    from: `"MyFin Bank" <${process.env.ADMIN_EMAIL}>`,
    to: process.env.EMAIL_USER,
    subject: `✅ Loan Settled — ${loanId}`,
    html: `
      <h2>Loan Settled</h2>
      <p>This is an automated alert from MyFin Bank.</p>
      <p><strong>Customer Name:</strong> ${customerName}</p>
      <p><strong>Loan ID:</strong> ${loanId}</p>
      <p><strong>Account Number:</strong> ${accountNumber}</p>
      <p>All EMIs have been successfully paid.</p>
      <p>Loan status has been changed to 
         <strong>CLOSED</strong>.</p>
      <br/>
      <p>MyFin Bank — Automated Notification System</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const sendAutoDeactivationAlert = async (
  customerName,
  accountNumber,
  customerEmail
) => {
  const mailOptions = {
    from: `"MyFin Bank" <${process.env.ADMIN_EMAIL}>`,
    to: customerEmail,
    subject: `⛔ Account Deactivated — ${accountNumber}`,
    html: `
      <h2>Account Deactivated</h2>
      <p>Dear ${customerName},</p>
      <p>Your account <strong>${accountNumber}</strong> 
         has been automatically deactivated due to 
         zero/exceeded balance for more than 24 hours.</p>
      <p>To reactivate your account, please make a deposit.</p>
      <br/>
      <p>MyFin Bank — Automated Notification System</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const sendPasswordResetOTP = async (
  customerName,
  customerEmail,
  otp
) => {
  const mailOptions = {
    from: `"MyFin Bank" <${process.env.ADMIN_EMAIL}>`,
    to: customerEmail,
    subject: `🔐 Password Reset OTP — MyFin Bank`,
    html: `
      <h2>Password Reset Request</h2>
      <p>Dear ${customerName},</p>
      <p>Your OTP for password reset is:</p>
      <h1 style="letter-spacing: 5px; color: #2563eb;">
        ${otp}
      </h1>
      <p>This OTP is valid for <strong>10 minutes</strong> only.</p>
      <p>If you did not request a password reset,
         please ignore this email.</p>
      <br/>
      <p>MyFin Bank — Security Team</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const sendTicketAcknowledgement = async (
  customerName,
  customerEmail,
  ticketId,
  subject
) => {
  const mailOptions = {
    from: `"MyFin Bank" <${process.env.ADMIN_EMAIL}>`,
    to: customerEmail,
    subject: `🎫 Support Ticket Raised — ${ticketId}`,
    html: `
      <h2>Support Ticket Acknowledged</h2>
      <p>Dear ${customerName},</p>
      <p>Your support ticket has been successfully raised.</p>
      <br/>
      <p><strong>Ticket ID:</strong> ${ticketId}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Status:</strong> OPEN</p>
      <br/>
      <p>Our team will get back to you shortly.</p>
      <p>You can track your ticket status by logging 
         into MyFin Bank.</p>
      <br/>
      <p>MyFin Bank — Customer Support Team</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const sendAdminReplyNotification = async (
  customerName,
  customerEmail,
  ticketId,
  adminMessage
) => {
  const mailOptions = {
    from: `"MyFin Bank" <${process.env.ADMIN_EMAIL}>`,
    to: customerEmail,
    subject: `💬 Admin Replied — Ticket ${ticketId}`,
    html: `
      <h2>New Reply on Your Support Ticket</h2>
      <p>Dear ${customerName},</p>
      <p>Our support team has responded to your 
         ticket <strong>${ticketId}</strong>.</p>
      <br/>
      <h3>Admin Response:</h3>
      <p style="background:#f3f4f6; padding:12px; 
         border-left: 4px solid #2563eb;">
        ${adminMessage}
      </p>
      <br/>
      <p>If you are satisfied with the response,
         no further action is needed.</p>
      <p>If you need further assistance, please 
         reply to your ticket by logging into 
         MyFin Bank.</p>
      <br/>
      <p>MyFin Bank — Customer Support Team</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const sendTicketResolvedNotification = async (
  customerName,
  customerEmail,
  ticketId,
  subject
) => {
  const mailOptions = {
    from: `"MyFin Bank" <${process.env.ADMIN_EMAIL}>`,
    to: customerEmail,
    subject: `✅ Ticket Resolved — ${ticketId}`,
    html: `
      <h2>Support Ticket Resolved</h2>
      <p>Dear ${customerName},</p>
      <p>Your support ticket has been resolved 
         by our team.</p>
      <br/>
      <p><strong>Ticket ID:</strong> ${ticketId}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Status:</strong> RESOLVED</p>
      <br/>
      <p>We hope your issue has been addressed 
         satisfactorily.</p>
      <p>Thank you for banking with MyFin Bank! 🏦</p>
      <br/>
      <p>MyFin Bank — Customer Support Team</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const sendEMIFailureAlert = async (customerName, customerEmail, loanId, emiAmount) => {
  const customerMailOptions = {
    from: `"MyFin Bank" <${process.env.ADMIN_EMAIL}>`,
    to: customerEmail,
    subject: `⚠️ EMI Payment Failed — ${loanId}`,
    html: `
      <h2>EMI Payment Failed</h2>
      <p>Dear ${customerName},</p>
      <p>We were unable to process your EMI payment for loan 
         <strong>${loanId}</strong> due to insufficient balance.</p>
      <p><strong>EMI Amount:</strong> ₹${emiAmount}</p>
      <p>Please ensure sufficient funds are available in your 
         account to avoid loan default.</p>
      <p>If you have any queries, please contact our support team.</p>
      <br/>
      <p>MyFin Bank — Automated Notification System</p>
    `,
  };

  const adminMailOptions = {
    from: `"MyFin Bank" <${process.env.ADMIN_EMAIL}>`,
    to: process.env.EMAIL_USER,
    subject: `⚠️ EMI Payment Failed — ${loanId}`,
    html: `
      <h2>EMI Payment Failed</h2>
      <p>This is an automated alert from MyFin Bank.</p>
      <p><strong>Customer Name:</strong> ${customerName}</p>
      <p><strong>Loan ID:</strong> ${loanId}</p>
      <p><strong>EMI Amount:</strong> ₹${emiAmount}</p>
      <p>The EMI payment failed due to insufficient balance 
         in the customer's account.</p>
      <br/>
      <p>MyFin Bank — Automated Notification System</p>
    `,
  };

  await transporter.sendMail(customerMailOptions);
  await transporter.sendMail(adminMailOptions);
};

const sendAccountApprovedEmail = async (customerName, customerEmail, accountNumber, accountType) => {
  const mailOptions = {
    from: `"MyFin Bank" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `✅ Your ${accountType} Account is Approved — ${accountNumber}`,
    html: `
      <h2>Account Approved! ✅</h2>
      <p>Dear ${customerName},</p>
      <p>Your <strong>${accountType} Account</strong> has been 
         successfully approved by our team.</p>
      <br/>
      <h3>Account Details:</h3>
      <p><strong>Account Number:</strong> ${accountNumber}</p>
      <p><strong>Account Type:</strong> ${accountType}</p>
      ${accountType === "CURRENT" ? `<p><strong>Overdraft Limit:</strong> ₹5,000</p>` : ""}
      <br/>
      <p>You can now use this account for deposits, 
         withdrawals and fund transfers.</p>
      <br/>
      <p>MyFin Bank — Customer Support Team</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendZeroBalanceAlert,
  sendOverdraftAlert,
  sendAccountRecoveryAlert,
  sendLoanSettledAlert,
  sendWelcomeEmail,
  sendAutoDeactivationAlert,
  sendPasswordResetOTP,
  sendTicketAcknowledgement,
  sendAdminReplyNotification,
  sendTicketResolvedNotification,
  sendEMIFailureAlert,
  sendAccountApprovedEmail,
};