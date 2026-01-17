require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('📧 Testing Email Configuration...\n');
console.log('Configuration:');
console.log('  SMTP_HOST:', process.env.SMTP_HOST);
console.log('  SMTP_PORT:', process.env.SMTP_PORT);
console.log('  SMTP_SECURE:', process.env.SMTP_SECURE);
console.log('  SMTP_USER:', process.env.SMTP_USER);
console.log('  SMTP_PASS:', process.env.SMTP_PASS ? '***configured***' : 'NOT SET');
console.log('');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    debug: true,
    logger: true
});

console.log('🔍 Verifying SMTP connection...\n');

transporter.verify(function (error, success) {
    if (error) {
        console.error('❌ SMTP Connection Failed:');
        console.error('Error:', error.message);
        console.error('\nCommon issues:');
        console.error('1. Invalid app password - Generate a new one at https://myaccount.google.com/apppasswords');
        console.error('2. 2-Step Verification not enabled on Gmail account');
        console.error('3. "Less secure app access" needs to be enabled (deprecated)');
        console.error('4. Wrong SMTP host or port');
        console.error('5. Network/firewall blocking SMTP port 587');
        process.exit(1);
    } else {
        console.log('✅ SMTP Server is ready to send emails!');
        console.log('\n📨 Sending test email...\n');

        // Send a test email
        const mailOptions = {
            from: `"${process.env.APP_NAME || 'HackForge'}" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER, // Send to self for testing
            subject: 'Test Email - HackForge Email Service',
            html: `
        <h1>Email Service Test</h1>
        <p>This is a test email from your HackForge backend.</p>
        <p>If you received this, your email service is working correctly! ✅</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
            text: `Email Service Test\n\nThis is a test email from your HackForge backend.\nIf you received this, your email service is working correctly!\n\nTimestamp: ${new Date().toISOString()}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('❌ Failed to send test email:');
                console.error('Error:', error.message);
                process.exit(1);
            } else {
                console.log('✅ Test email sent successfully!');
                console.log('Message ID:', info.messageId);
                console.log('Response:', info.response);
                console.log('\n📬 Check your inbox at:', process.env.SMTP_USER);
                process.exit(0);
            }
        });
    }
});
