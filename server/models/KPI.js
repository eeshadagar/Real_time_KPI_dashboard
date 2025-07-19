const mongoose = require('mongoose');

const KPISchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  unit: {
    type: String,
    default: ''
  },
  target: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('KPI', KPISchema);