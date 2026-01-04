const RawMaterial = require('../models/RawMaterial');

// Get all raw materials
const getRawMaterials = async (req, res) => {
  try {
    const rawMaterials = await RawMaterial.find().populate('supplier', 'name');
    res.json(rawMaterials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single raw material
const getRawMaterial = async (req, res) => {
  try {
    const rawMaterial = await RawMaterial.findById(req.params.id).populate('supplier', 'name');
    if (!rawMaterial) {
      return res.status(404).json({ message: 'Raw material not found' });
    }
    res.json(rawMaterial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create raw material
const createRawMaterial = async (req, res) => {
  try {
    const rawMaterial = new RawMaterial(req.body);
    const savedRawMaterial = await rawMaterial.save();
    await savedRawMaterial.populate('supplier', 'name');
    res.status(201).json(savedRawMaterial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update raw material
const updateRawMaterial = async (req, res) => {
  try {
    const rawMaterial = await RawMaterial.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).populate('supplier', 'name');

    if (!rawMaterial) {
      return res.status(404).json({ message: 'Raw material not found' });
    }
    res.json(rawMaterial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete raw material
const deleteRawMaterial = async (req, res) => {
  try {
    const rawMaterial = await RawMaterial.findByIdAndDelete(req.params.id);
    if (!rawMaterial) {
      return res.status(404).json({ message: 'Raw material not found' });
    }
    res.json({ message: 'Raw material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRawMaterials,
  getRawMaterial,
  createRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
};
