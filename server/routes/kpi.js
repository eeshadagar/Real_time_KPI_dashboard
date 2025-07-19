const express = require('express');
const router = express.Router();
const KPI = require('../models/KPI');

// Get all KPIs
router.get('/', async (req, res) => {
  try {
    const kpis = await KPI.find().sort({ lastUpdated: -1 });
    res.json(kpis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update KPI
router.post('/', async (req, res) => {
  try {
    const { name, value, category, unit, target } = req.body;
    
    const kpi = await KPI.findOneAndUpdate(
      { name },
      { 
        value, 
        category, 
        unit, 
        target, 
        lastUpdated: new Date() 
      },
      { 
        upsert: true, 
        new: true 
      }
    );
    
    res.json(kpi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete KPI
router.delete('/:id', async (req, res) => {
  try {
    await KPI.findByIdAndDelete(req.params.id);
    res.json({ message: 'KPI deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;