const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: `"SmartHire Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

const sendBulkEmails = async (emails) => {
  try {
    const promises = emails.map(email => sendEmail(email));
    const results = await Promise.allSettled(promises);
    
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;
    
    console.log(`Bulk email results: ${successful} successful, ${failed} failed`);
    return { successful, failed, results };
  } catch (error) {
    console.error('Bulk email sending failed:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendBulkEmails
};