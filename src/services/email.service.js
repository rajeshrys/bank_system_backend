require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

module.exports = transporter;


// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name) {

    const subject = 'Welcome to Backend Ledger!';

    const text = `Hello ${name},\n\nThank you for registering at Backend Ledger.
    We're excited to have you on board!\n\nBest regards,\nThe Backend Ledger Team`;

    const html = `<p>Hello ${name},</p><p>Thank you for registering at Backend Ledger. We're excited to have you on board!</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}
async function sendTransactionEmail(userEmail, name, amount, toAccount) {

    const subject = 'Transaction Successful!';

    const text = `Hello ${name},

Your transaction of $${amount} to account ${toAccount} was completed successfully.

The amount has been transferred securely and your account balance has been updated.

Thank you for using Backend Ledger.

Best regards,
The Backend Ledger Team`;

    const html = `
    <p>Hello ${name},</p>

    <p>Your transaction of <b>$${amount}</b> to account <b>${toAccount}</b> was completed successfully.</p>

    <p>The amount has been transferred securely and your account balance has been updated.</p>

    <p>Thank you for using Backend Ledger.</p>

    <p>
        Best regards,<br>
        The Backend Ledger Team
    </p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {

    const subject = 'Transaction Failed';

    const text = `Hello ${name},

We regret to inform you that your transaction of $${amount} to account ${toAccount} could not be completed.

This may have happened due to insufficient balance, invalid account details, or a temporary server issue.

No amount has been deducted from your account.

Please try again later or contact support if the issue continues.

Best regards,
The Backend Ledger Team`;

    const html = `
    <p>Hello ${name},</p>

    <p>
        We regret to inform you that your transaction of 
        <b>$${amount}</b> to account 
        <b>${toAccount}</b> could not be completed.
    </p>

    <p>
        This may have happened due to insufficient balance, invalid account details,
        or a temporary server issue.
    </p>

    <p><b>No amount has been deducted from your account.</b></p>

    <p>Please try again later or contact support if the issue continues.</p>

    <p>
        Best regards,<br>
        The Backend Ledger Team
    </p>`;

    await sendEmail(userEmail, subject, text, html);
}

module.exports = {sendRegistrationEmail,sendTransactionEmail,
  sendTransactionFailureEmail
};