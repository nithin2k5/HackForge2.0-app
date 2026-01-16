# Quick Email Setup Guide

## Problem
Getting "Email service not configured" error.

## Quick Fix (2 minutes)

### Step 1: Get Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with your Gmail account
3. Select "Mail" and "Other (Custom name)"
4. Enter name: "HackForge Backend"
5. Click "Generate"
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 2: Add to backend/.env

Create or edit `backend/.env` file and add:

```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcdefghijklmnop
```

**Important:** Use the App Password (remove spaces), NOT your regular Gmail password.

### Step 3: Restart Backend

```bash
cd backend
npm run dev
```

That's it! Email verification will now work.

## Full Example .env

```env
PORT=8081
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hackforge_db
JWT_SECRET=your-secret-key
NODE_ENV=development

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
APP_NAME=HackForge
FRONTEND_URL=http://localhost:3000
USE_DEEP_LINK=true
```

## Troubleshooting

**"Invalid login" error:**
- Make sure you're using an App Password, not your regular password
- Ensure 2-Step Verification is enabled on your Google Account

**"Connection timeout":**
- Check internet connection
- Verify firewall isn't blocking port 587

**Still not working?**
- Check backend console for detailed error messages
- See `backend/EMAIL_SETUP.md` for more options (Outlook, Yahoo, etc.)
