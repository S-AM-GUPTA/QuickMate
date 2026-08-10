require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('Testing SMTP connection...');
  console.log('User:', process.env.SMTP_USER);
  console.log('Pass length:', process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log('? Server is ready to take our messages');
    const info = await transporter.sendMail({
      from: 'Test <' + process.env.SMTP_USER + '>',
      to: process.env.SMTP_USER,
      subject: 'Test Email from QuickMate',
      text: 'If you are reading this, nodemailer is working!'
    });
    console.log('? Message sent:', info.messageId);
  } catch (error) {
    console.error('? Failed to connect/send:', error);
  }
}

testEmail();
