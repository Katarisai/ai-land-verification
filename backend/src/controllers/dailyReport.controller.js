const DailyReport = require('../models/DailyReport');

// Get all daily reports
const getDailyReports = async (req, res) => {
  try {
    const dailyReports = await DailyReport.find()
      .populate('project', 'name')
      .populate('worker', 'name')
      .sort({ date: -1 });
    res.json(dailyReports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single daily report
const getDailyReport = async (req, res) => {
  try {
    const dailyReport = await DailyReport.findById(req.params.id)
      .populate('project', 'name')
      .populate('worker', 'name');
    if (!dailyReport) {
      return res.status(404).json({ message: 'Daily report not found' });
    }
    res.json(dailyReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create daily report
const createDailyReport = async (req, res) => {
  try {
    const dailyReport = new DailyReport(req.body);
    const savedDailyReport = await dailyReport.save();
    await savedDailyReport.populate('project', 'name');
    await savedDailyReport.populate('worker', 'name');
    res.status(201).json(savedDailyReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update daily report
const updateDailyReport = async (req, res) => {
  try {
    const dailyReport = await DailyReport.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    )
      .populate('project', 'name')
      .populate('worker', 'name');

    if (!dailyReport) {
      return res.status(404).json({ message: 'Daily report not found' });
    }
    res.json(dailyReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete daily report
const deleteDailyReport = async (req, res) => {
  try {
    const dailyReport = await DailyReport.findByIdAndDelete(req.params.id);
    if (!dailyReport) {
      return res.status(404).json({ message: 'Daily report not found' });
    }
    res.json({ message: 'Daily report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDailyReports,
  getDailyReport,
  createDailyReport,
  updateDailyReport,
  deleteDailyReport,
};
