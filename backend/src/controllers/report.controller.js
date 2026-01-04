const Report = require('../models/Report');

// Get all reports
const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('project', 'name')
      .populate('generatedBy', 'name')
      .sort({ generatedAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single report
const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('project', 'name')
      .populate('generatedBy', 'name');
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create report
const createReport = async (req, res) => {
  try {
    const report = new Report(req.body);
    const savedReport = await report.save();
    await savedReport.populate('project', 'name');
    await savedReport.populate('generatedBy', 'name');
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update report
const updateReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    )
      .populate('project', 'name')
      .populate('generatedBy', 'name');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete report
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
};
