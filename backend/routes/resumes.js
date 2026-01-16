const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const Resume = require('../models/Resume');
const { authenticate } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/resumes');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: fileFilter
});

router.get('/', authenticate, async (req, res) => {
  try {
    const filters = { ...req.query, user_id: req.user.id };
    const resumes = await Resume.findAll(filters);
    res.json(resumes);
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    if (resume.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.json(resume);
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticate, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required' });
    }

    const fileUrl = `/uploads/resumes/${req.file.filename}`;
    const fileSize = req.file.size;

    const existingActive = await Resume.findAll({ user_id: req.user.id, is_active: true });
    if (existingActive.length > 0) {
      for (const resume of existingActive) {
        await Resume.update(resume.id, { is_active: false });
      }
    }

    const resume = await Resume.create({
      user_id: req.user.id,
      file_name: req.file.originalname,
      file_url: fileUrl,
      file_size: fileSize,
      version: 1,
      is_active: true
    });

    res.status(201).json({ message: 'Resume uploaded successfully', resume });
  } catch (error) {
    console.error('Upload resume error:', error);
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads/resumes', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.put('/:id/active', authenticate, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    if (resume.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updated = await Resume.setActive(req.user.id, req.params.id);
    res.json({ message: 'Resume set as active', resume: updated });
  } catch (error) {
    console.error('Set active resume error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    if (resume.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Resume.delete(req.params.id);
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


