const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const companiesRoutes = require('./routes/companies');
const jobsRoutes = require('./routes/jobs');
const applicationsRoutes = require('./routes/applications');
const resumesRoutes = require('./routes/resumes');
const savedJobsRoutes = require('./routes/savedJobs');
const interviewsRoutes = require('./routes/interviews');
const notificationsRoutes = require('./routes/notifications');

const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8085;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const resumesDir = path.join(uploadsDir, 'resumes');
if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Groei API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/resumes', resumesRoutes);
app.use('/api/saved-jobs', savedJobsRoutes);
app.use('/api/interviews', interviewsRoutes);
app.use('/api/notifications', notificationsRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    error: err.message || 'Something went wrong!',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
  console.log(`📱 For emulator: Use your computer's IP address (e.g., http://192.168.1.12:${PORT})`);
  console.log(`\n💡 Test the API: node scripts/test-api.js`);
});


