const express = require('express');
const router = express.Router();
const Land = require('../models/Land');
let aiService;
try { aiService = require('../services/aiService'); } catch (e) { aiService = null; }
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const { addJob } = require('../services/jobQueue');

// Setup multer for file uploads
const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads', 'documents');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadsDir); },
  filename: function (req, file, cb) {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    const safe = file.originalname.replace(/[^a-zA-Z0-9.\-\_]/g, '_');
    cb(null, `${unique}-${safe}`);
  }
});
const upload = multer({ storage });

// Create / Upload new land
router.post('/upload', async (req, res) => {
  try {
    // minimal validation
    const payload = req.body || {};
    if (!payload.surveyNumber || !payload.owner || !payload.location || !payload.property || !payload.legal) {
      return res.status(400).json({ error: 'Missing required land fields' });
    }

    const landId = `LND-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

    const landDoc = new Land({
      landId,
      surveyNumber: payload.surveyNumber,
      owner: payload.owner,
      location: payload.location,
      property: payload.property,
      legal: payload.legal,
      documents: payload.documents || [],
      aiProcessing: payload.aiProcessing || { processedDate: null, processingStatus: 'InProgress', aiSummary: 'Pending AI summary', chatContext: 'Pending chat context' },
      imageGallery: payload.imageGallery || [],
      verification: payload.verification || { overallStatus: 'Pending', verificationSteps: [] },
      chatHistory: payload.chatHistory || [],
      leads: payload.leads || [],
      auditLog: payload.auditLog || [],
      isPublished: payload.isPublished || false,
      isActive: payload.isActive !== undefined ? payload.isActive : true
    });

    await landDoc.save();
    // Trigger AI analysis (if OpenAI configured)
    if (aiService && process.env.OPENAI_API_KEY) {
      try {
        const analysis = await aiService.analyzeLand(landDoc);
        landDoc.aiProcessing = landDoc.aiProcessing || {};
        landDoc.aiProcessing.aiSummary = analysis.aiSummary;
        landDoc.aiProcessing.chatContext = analysis.chatContext;
        landDoc.aiProcessing.processedDate = new Date();
        landDoc.aiProcessing.processingStatus = 'Complete';
        landDoc.aiProcessing.ocrConfidenceScore = landDoc.aiProcessing.ocrConfidenceScore || null;
        await landDoc.save();
      } catch (err) {
        console.error('AI analysis failed:', err.message || err);
        // keep going; AI processing is optional
      }
    }

    res.json({ message: 'Land uploaded successfully', land: landDoc, landId });
  } catch (err) {
    console.error('Error uploading land', err);
    if (err.code === 11000) return res.status(409).json({ error: 'Duplicate landId or unique field' });
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single land by landId
router.get('/:landId', async (req, res) => {
  try {
    const land = await Land.findOne({ landId: req.params.landId });
    if (!land) return res.status(404).json({ error: 'Land not found' });
    res.json({ land });
  } catch (err) {
    console.error('Get land error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// List/search lands with simple filters
router.get('/', async (req, res) => {
  try {
    const { city, state, type, verified, limit = 20, skip = 0 } = req.query;
    const query = {};
    if (city) query['location.city'] = city;
    if (state) query['location.state'] = state;
    if (type) query['property.type'] = type;
    if (verified !== undefined) query['verification.overallStatus'] = verified === 'true' ? 'Approved' : { $ne: 'Approved' };

    const lands = await Land.find(query).limit(Number(limit)).skip(Number(skip));
    const total = await Land.countDocuments(query);
    res.json({ lands, total, limit: Number(limit), skip: Number(skip) });
  } catch (err) {
    console.error('List lands error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update land by landId (partial update)
router.put('/:landId', async (req, res) => {
  try {
    const updates = req.body || {};
    // prevent changing landId
    delete updates.landId;

    const land = await Land.findOneAndUpdate({ landId: req.params.landId }, { $set: updates }, { new: true });
    if (!land) return res.status(404).json({ error: 'Land not found' });
    res.json({ message: 'Land updated', land });
  } catch (err) {
    console.error('Update land error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload a document for a land and run OCR + AI analysis
router.post('/:landId/documents', upload.single('file'), async (req, res) => {
  try {
    const land = await Land.findOne({ landId: req.params.landId });
    if (!land) return res.status(404).json({ error: 'Land not found' });

    if (!req.file) return res.status(400).json({ error: 'No file uploaded (expect field name "file")' });

    const filePath = req.file.path;
    const doc = {
      documentId: `DOC-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      type: req.body.type || 'Other',
      fileName: req.file.originalname,
      fileUrl: `/uploads/documents/${path.basename(filePath)}`,
      uploadDate: new Date(),
      fileSize: req.file.size || 0,
      status: 'Uploaded',
      ocrExtracted: false,
      extractedText: ''
    };

    land.documents = land.documents || [];
    land.documents.push(doc);
    await land.save();

    // Enqueue background processing job
    try {
      addJob({ type: 'processDocument', landId: land.landId, document: { documentId: doc.documentId, filePath, fileName: doc.fileName } });
    } catch (e) {
      console.error('Failed to enqueue document job', e.message || e);
    }

    res.json({ message: 'Document uploaded and queued for processing', document: doc, land });
  } catch (err) {
    console.error('Document upload error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
