const nodemailer = require("nodemailer");

// Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection
transporter.verify((error) => {
  if (error) {
    console.log("Email server error:", error);
  } else {
    console.log("Banking Email Service Ready ✔");
  }
});

// Generic send function
const sendEmail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: `"Digital Banking System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent ✔");
  } catch (error) {
    console.log("Email error:", error);
  }
};





const sendRegistrationEmail = async (email, name) => {
  const subject = "Welcome to Digital Banking System";

  const text = `Dear ${name},

Welcome to Digital Banking System.

Your account has been successfully created. You can now securely access your banking dashboard, manage transactions, and monitor your account activity anytime.

If you did not initiate this registration, please contact our support team immediately.

Regards,  
Digital Banking Security Team`;

  const html = `
    <h2>Welcome, ${name}</h2>
    <p>Your account has been successfully created with <b>Digital Banking System</b>.</p>
    <p>You can now securely access your dashboard and manage your financial activities.</p>
    <br/>
    <p style="color:gray;">If this was not you, please contact support immediately.</p>
    <br/>
    <b>Digital Banking Security Team</b>
  `;

  return sendEmail(email, subject, text, html);
};



const sendTransactionEmail = async (email, name, amount, toAccount) => {
  const subject = "Transaction Successful - Digital Banking";

  const text = `Dear ${name},

We are pleased to inform you that your transaction has been successfully completed.

Transaction Details:
Amount: ₹${amount}
Recipient Account: ${toAccount}
Status: SUCCESS

If you did not authorize this transaction, please contact your bank immediately.

Thank you for using Digital Banking System.

Regards,  
Transaction Services Team`;

  const html = `
    <h2>Transaction Successful ✔</h2>
    <p>Dear ${name},</p>

    <p>Your transaction has been completed successfully.</p>

    <ul>
      <li><b>Amount:</b> ₹${amount}</li>
      <li><b>Recipient Account:</b> ${toAccount}</li>
      <li><b>Status:</b> SUCCESS</li>
    </ul>

    <p>If you did not authorize this transaction, contact support immediately.</p>

    <br/>
    <b>Digital Banking System</b>
  `;

  return sendEmail(email, subject, text, html);
};


const sendTransactionFailureEmail = async (email, name, amount, reason = "") => {
  const subject = "Transaction Failed - Digital Banking Alert";

  const text = `Dear ${name},

We regret to inform you that your recent transaction could not be completed.

Amount: ₹${amount}
Reason: ${reason || "Insufficient details / system issue"}

Please try again later or contact support if the issue persists.

Regards,  
Digital Banking Support Team`;

  const html = `
    <h2>Transaction Failed ❌</h2>
    <p>Dear ${name},</p>

    <p>We were unable to process your transaction.</p>

    <ul>
      <li><b>Amount:</b> ₹${amount}</li>
      <li><b>Reason:</b> ${reason || "System issue"}</li>
    </ul>

    <p>Please try again or contact support.</p>

    <br/>
    <b>Digital Banking Support Team</b>
  `;

  return sendEmail(email, subject, text, html);
};



module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailureEmail,
};