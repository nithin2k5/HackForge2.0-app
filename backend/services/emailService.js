const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️  SMTP credentials not configured.');
    console.warn('📧 To enable email sending, add to backend/.env:');
    console.warn('   SMTP_USER=your-email@gmail.com');
    console.warn('   SMTP_PASS=your-app-password');
    console.warn('');
    console.warn('💡 For development, registration will still work but emails won\'t be sent.');
    console.warn('💡 Check backend/EMAIL_SETUP.md for detailed setup instructions.');
    return null;
  }

  try {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } catch (error) {
    console.error('❌ Error creating email transporter:', error);
    return null;
  }
};

const sendVerificationEmail = async (email, name, verificationCode) => {
  const transporter = createTransporter();
  if (!transporter) {
    throw new Error('EMAIL_SERVICE_NOT_CONFIGURED');
  }
  
  try {
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'HackForge'}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Verify Your Email Address - HackForge',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #ffffff; margin: 0;">Welcome to HackForge!</h1>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hi ${name},</p>
            <p style="font-size: 16px;">Thank you for signing up! Please use the verification code below to complete your registration.</p>
            <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f5f5f5; border-radius: 8px;">
              <p style="font-size: 14px; color: #666; margin: 0 0 10px 0;">Your verification code:</p>
              <p style="font-size: 36px; font-weight: bold; color: #6366f1; letter-spacing: 8px; margin: 0; font-family: monospace;">${verificationCode}</p>
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">This code will expire in 10 minutes.</p>
            <p style="font-size: 14px; color: #666;">If you didn't create an account, please ignore this email.</p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} HackForge. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to HackForge!
        
        Hi ${name},
        
        Thank you for signing up! Please use the verification code below to complete your registration:
        
        ${verificationCode}
        
        This code will expire in 10 minutes.
        
        If you didn't create an account, please ignore this email.
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

const sendPasswordResetEmail = async (email, name, resetCode) => {
  const transporter = createTransporter();
  if (!transporter) {
    throw new Error('EMAIL_SERVICE_NOT_CONFIGURED');
  }
  
  try {
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'HackForge'}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Reset Your Password - HackForge',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #ffffff; margin: 0;">Password Reset Request</h1>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hi ${name},</p>
            <p style="font-size: 16px;">We received a request to reset your password. Please use the verification code below to reset your password.</p>
            <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f5f5f5; border-radius: 8px;">
              <p style="font-size: 14px; color: #666; margin: 0 0 10px 0;">Your password reset code:</p>
              <p style="font-size: 36px; font-weight: bold; color: #6366f1; letter-spacing: 8px; margin: 0; font-family: monospace;">${resetCode}</p>
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">This code will expire in 10 minutes.</p>
            <p style="font-size: 14px; color: #666;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} HackForge. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request
        
        Hi ${name},
        
        We received a request to reset your password. Please use the verification code below to reset your password:
        
        ${resetCode}
        
        This code will expire in 10 minutes.
        
        If you didn't request a password reset, please ignore this email.
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
