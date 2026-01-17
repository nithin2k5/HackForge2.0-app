const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { authenticate } = require('../middleware/auth');
const Resume = require('../models/Resume');

router.get('/', authenticate, async (req, res) => {
  try {
    const filters = { ...req.query, user_id: req.user.id };
    const applications = await Application.findAll(filters);
    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    if (application.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.json(application);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    console.log('📝 Application submission request received');
    console.log('   User ID:', req.user.id);
    console.log('   Request body:', JSON.stringify(req.body, null, 2));

    let { job_id, company_id, status, match_score, resume_url, cover_letter, notes } = req.body;

    if (!job_id || !company_id) {
      console.error('❌ Missing required fields:', { job_id, company_id });
      return res.status(400).json({ error: 'Job ID and Company ID are required' });
    }

    console.log('   Checking for existing application...');
    const existing = await Application.findByUserAndJob(req.user.id, job_id);
    if (existing) {
      console.error('❌ Application already exists:', existing.id);
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    // If no resume_url provided, try to find the user's active resume
    if (!resume_url) {
      console.log('   No resume_url provided, looking up active resume...');
      const activeResumes = await Resume.findAll({ user_id: req.user.id, is_active: true });
      if (activeResumes && activeResumes.length > 0) {
        resume_url = activeResumes[0].file_url;
        console.log('   Found active resume:', resume_url);
      } else {
        console.log('   No active resume found.');
      }
    }

    console.log('   Creating new application...');
    const application = await Application.create({
      user_id: req.user.id,
      job_id,
      company_id,
      status,
      match_score,
      resume_url, // URL or null (handled by model)
      cover_letter,
      notes,
      interview_date: null
    });

    console.log('✅ Application submitted successfully:', application.id);
    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('❌ Application submission error:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    if (application.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updated = await Application.update(req.params.id, req.body);
    res.json({ message: 'Application updated successfully', application: updated });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


