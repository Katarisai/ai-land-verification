const { pdfToImages } = require('./pdfConvert');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const aiService = (() => { try { return require('./aiService'); } catch (e) { return null; } })();
const Land = require('../models/Land');

// Simple in-memory job queue
const jobs = new Map();
const queue = [];
let processing = false;

function newJobId() { return `JOB-${Date.now()}-${Math.random().toString(36).slice(2,6)}`; }

function addJob(job) {
  const id = newJobId();
  const record = { id, status: 'queued', createdAt: new Date(), job };
  jobs.set(id, record);
  queue.push(id);
  processQueue();
  return id;
}

function getJob(id) { return jobs.get(id); }

async function processQueue() {
  if (processing) return;
  processing = true;
  while (queue.length) {
    const id = queue.shift();
    const rec = jobs.get(id);
    if (!rec) continue;
    rec.status = 'processing';
    try {
      if (rec.job.type === 'processDocument') {
        await handleProcessDocument(rec);
      } else if (rec.job.type === 'reprocessLand') {
        await handleReprocessLand(rec);
      }
      rec.status = 'completed';
      rec.completedAt = new Date();
    } catch (err) {
      rec.status = 'failed';
      rec.error = err.message || String(err);
      rec.completedAt = new Date();
      console.error('Job failed', id, err);
    }
  }
  processing = false;
}

async function handleProcessDocument(rec) {
  const { landId, document } = rec.job;
  const land = await Land.findOne({ landId });
  if (!land) throw new Error('Land not found for document job');

  const filePath = path.resolve(document.filePath);
  let extractedText = '';

    // If the file is a plain text file, read it directly instead of OCR
    const textExts = ['.txt', '.md', '.json', '.csv'];
    const ext = path.extname(document.fileName).toLowerCase();
    if (textExts.includes(ext)) {
      try {
        extractedText = fs.readFileSync(document.filePath, 'utf8');
      } catch (e) {
        console.warn('Plain text read failed', e.message || e);
      }
    }

    // If still empty and not a plain text file, attempt OCR (may require tesseract/core assets)
    if (!extractedText.trim()) {
      try {
        const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
        extractedText = text || '';
      } catch (e) {
        console.warn('Tesseract direct OCR failed', e.message || e);
      }
    }

  // Update document in Land
  const doc = land.documents.find(d => d.documentId === document.documentId);
  if (doc) {
    doc.extractedText = extractedText;
    doc.ocrExtracted = !!extractedText;
    doc.status = 'Processed';
  }
  await land.save();

  // Re-run AI analysis if available
  if (aiService && process.env.OPENAI_API_KEY) {
    try {
      const analysis = await aiService.analyzeLand(land);
      land.aiProcessing = land.aiProcessing || {};
      land.aiProcessing.aiSummary = analysis.aiSummary;
      land.aiProcessing.chatContext = analysis.chatContext;
      land.aiProcessing.processedDate = new Date();
      land.aiProcessing.processingStatus = 'Complete';
      await land.save();
    } catch (e) {
      console.error('AI re-analysis failed in job:', e.message || e);
    }
  }
}

async function handleReprocessLand(rec) {
  const { landId } = rec.job;
  const land = await Land.findOne({ landId });
  if (!land) throw new Error('Land not found for reprocess job');
  if (aiService && process.env.OPENAI_API_KEY) {
    const analysis = await aiService.analyzeLand(land);
    land.aiProcessing = land.aiProcessing || {};
    land.aiProcessing.aiSummary = analysis.aiSummary;
    land.aiProcessing.chatContext = analysis.chatContext;
    land.aiProcessing.processedDate = new Date();
    land.aiProcessing.processingStatus = 'Complete';
    await land.save();
  }
}

module.exports = { addJob, getJob, jobs };
