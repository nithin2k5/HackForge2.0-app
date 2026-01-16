# Email Configuration Guide

## Required .env Variables for Nodemailer

Add these variables to your `backend/.env` file:

```env
# Required: SMTP Server Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Required: Application Settings
APP_NAME=HackForge
FRONTEND_URL=http://localhost:3000
```

## Variable Descriptions

- **SMTP_HOST**: Your email provider's SMTP server address
- **SMTP_PORT**: SMTP port (usually 587 for TLS, 465 for SSL)
- **SMTP_SECURE**: Set to `true` for SSL (port 465), `false` for TLS (port 587)
- **SMTP_USER**: Your email address
- **SMTP_PASS**: Your email password or app password
- **APP_NAME**: Name shown in email "From" field
- **FRONTEND_URL**: Base URL for verification/reset links in emails

### Step 2: Get Gmail App Password

If using Gmail, you need to create an App Password (not your regular password):

1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Enter "HackForge Backend" as the name
6. Click **Generate**
7. Copy the 16-character password
8. Use this password as `SMTP_PASS` in your `.env` file

### Step 3: Alternative Email Providers

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Custom SMTP:**
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password
```

### Step 4: Test Email Configuration

After configuring, restart your backend server:

```bash
npm run dev
```

Try registering a new user. If email sending fails, check:
1. Backend console logs for detailed error messages
2. SMTP credentials are correct
3. Firewall isn't blocking port 587
4. 2-Step Verification is enabled (for Gmail)

### Step 5: Development Mode (Skip Email)

If you want to test without email during development, the registration will still work but show a warning. You can manually verify users in the database or use the verification token from the response (only in development mode).

## Troubleshooting

### "Invalid login" error
- Check that `SMTP_USER` and `SMTP_PASS` are correct
- For Gmail, make sure you're using an App Password, not your regular password

### "Connection timeout" error
- Check your internet connection
- Verify SMTP_HOST and SMTP_PORT are correct
- Check if your firewall is blocking port 587

### "Authentication failed" error
- Verify your email and password are correct
- For Gmail, ensure 2-Step Verification is enabled and you're using an App Password
