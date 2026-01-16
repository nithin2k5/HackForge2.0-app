const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailService = require('../services/emailService');

const pendingRegistrations = new Map();

const register = async (req, res) => {
  try {
    const { name, email, password, phone, location, title } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const existingPending = pendingRegistrations.get(email);
    if (existingPending) {
      const now = new Date();
      if (existingPending.expires > now) {
        return res.status(400).json({ error: 'Registration already in progress. Please check your email for the OTP code.' });
      }
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date();
    verificationExpires.setMinutes(verificationExpires.getMinutes() + 10);

    const registrationData = {
      name,
      email,
      password,
      phone: phone || null,
      location: location || null,
      title: title || null,
      verificationCode,
      expires: verificationExpires,
      createdAt: new Date()
    };

    pendingRegistrations.set(email, registrationData);

    setTimeout(() => {
      const stored = pendingRegistrations.get(email);
      if (stored && stored.expires < new Date()) {
        pendingRegistrations.delete(email);
      }
    }, 10 * 60 * 1000);

    let emailSent = false;
    let emailError = null;
    let verificationCodeForDev = null;
    
    try {
      await emailService.sendVerificationEmail(email, name, verificationCode);
      console.log('Verification OTP sent successfully');
      emailSent = true;
    } catch (emailErr) {
      console.error('Error sending verification email:', emailErr);
      if (emailErr.message === 'EMAIL_SERVICE_NOT_CONFIGURED') {
        emailError = 'Email service not configured';
        if (process.env.NODE_ENV === 'development') {
          verificationCodeForDev = verificationCode;
        }
      } else {
        emailError = emailErr.message || 'Email service error';
      }
    }

    if (emailSent) {
      res.status(200).json({
        message: 'Please check your email for the verification code to complete registration.',
        email: email
      });
    } else {
      const isDevelopment = process.env.NODE_ENV === 'development';
      res.status(200).json({
        message: 'Please verify your email to complete registration.',
        warning: emailError === 'Email service not configured' 
          ? 'Email service is not configured. For development, you can verify manually.'
          : 'Verification email could not be sent. Please use the resend verification feature.',
        emailError: emailError,
        email: email,
        verificationCode: isDevelopment ? verificationCodeForDev || verificationCode : undefined,
        devNote: isDevelopment ? 'In development mode: Use this OTP code to verify manually via /verify-otp endpoint or configure SMTP in .env' : undefined
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await User.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        title: user.title,
        company_id: user.company_id,
        email_verified: user.email_verified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, location, title, company_id } = req.body;
    const user = await User.update(req.user.id, { name, phone, location, title, company_id });
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    const user = await User.findByVerificationToken(token);
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    await User.verifyEmail(user.id);

    res.json({
      message: 'Email verified successfully. You can now log in.',
      verified: true
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }

    const pendingRegistration = pendingRegistrations.get(email);
    
    if (!pendingRegistration) {
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        if (existingUser.email_verified) {
          return res.status(400).json({ error: 'Email already verified. Please log in.' });
        }
        return res.status(400).json({ error: 'Registration expired. Please register again.' });
      }
      return res.status(400).json({ error: 'No pending registration found. Please register again.' });
    }

    if (pendingRegistration.expires < new Date()) {
      pendingRegistrations.delete(email);
      return res.status(400).json({ error: 'Verification code has expired. Please register again.' });
    }

    if (pendingRegistration.verificationCode !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      pendingRegistrations.delete(email);
      return res.status(400).json({ error: 'Email already registered. Please log in.' });
    }

    const user = await User.create({
      name: pendingRegistration.name,
      email: pendingRegistration.email,
      password: pendingRegistration.password,
      phone: pendingRegistration.phone,
      location: pendingRegistration.location,
      title: pendingRegistration.title
    });

    await User.verifyEmail(user.id);

    pendingRegistrations.delete(email);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Email verified and account created successfully.',
      verified: true,
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        email_verified: true
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      if (existingUser.email_verified) {
        return res.status(400).json({ error: 'Email already verified. Please log in.' });
      }
      return res.status(400).json({ error: 'Registration expired. Please register again.' });
    }

    const pendingRegistration = pendingRegistrations.get(email);
    if (!pendingRegistration) {
      return res.status(404).json({ error: 'No pending registration found. Please register again.' });
    }

    if (pendingRegistration.expires < new Date()) {
      pendingRegistrations.delete(email);
      return res.status(400).json({ error: 'Registration expired. Please register again.' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date();
    verificationExpires.setMinutes(verificationExpires.getMinutes() + 10);

    pendingRegistration.verificationCode = verificationCode;
    pendingRegistration.expires = verificationExpires;

    try {
      await emailService.sendVerificationEmail(email, pendingRegistration.name, verificationCode);
      res.json({ message: 'Verification code sent successfully' });
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      
      if (emailError.message === 'EMAIL_SERVICE_NOT_CONFIGURED') {
        const isDevelopment = process.env.NODE_ENV === 'development';
        res.status(503).json({ 
          error: 'Email service not configured',
          message: isDevelopment 
            ? `Email service not configured. For development, you can verify manually. Check backend console for OTP code or configure SMTP in backend/.env file. See backend/EMAIL_SETUP.md for instructions.`
            : 'Email service is not configured. Please contact support.',
          verificationCode: isDevelopment ? verificationCode : undefined,
          setupInstructions: isDevelopment ? 'Add SMTP_USER and SMTP_PASS to backend/.env file. See backend/EMAIL_SETUP.md for details.' : undefined
        });
      } else {
        res.status(500).json({ 
          error: 'Failed to send verification email',
          message: emailError.message || 'Email service error. Please check SMTP configuration.'
        });
      }
    }
  } catch (error) {
    console.error('Resend verification email error:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findByEmail(email);
    
    if (user) {
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const resetExpires = new Date();
      resetExpires.setMinutes(resetExpires.getMinutes() + 10);

      await User.updateResetToken(user.id, resetCode, resetExpires);

      try {
        await emailService.sendPasswordResetEmail(user.email, user.name, resetCode);
        console.log('Password reset OTP sent successfully to:', email);
      } catch (emailError) {
        console.error('Error sending password reset email:', emailError);
      }
    }

    res.json({ 
      message: 'If an account with that email exists, a password reset code has been sent.',
      sent: true
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const verifyResetOTP = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.reset_token || user.reset_token !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    if (!user.reset_token_expires || new Date(user.reset_token_expires) < new Date()) {
      return res.status(400).json({ error: 'Verification code has expired' });
    }

    res.json({ 
      message: 'Verification code verified successfully',
      verified: true
    });
  } catch (error) {
    console.error('Verify reset OTP error:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, code, password } = req.body;

    if (!email || !code || !password) {
      return res.status(400).json({ error: 'Email, verification code, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.reset_token || user.reset_token !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    if (!user.reset_token_expires || new Date(user.reset_token_expires) < new Date()) {
      return res.status(400).json({ error: 'Verification code has expired' });
    }

    await User.update(user.id, { password });
    await User.clearResetToken(user.id);

    res.json({
      message: 'Password reset successfully. You can now log in with your new password.',
      success: true
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  verifyEmail,
  verifyOTP,
  resendVerificationEmail,
  forgotPassword,
  verifyResetOTP,
  resetPassword
};


