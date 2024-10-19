const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'employees' },
  documentType: { type: String, required: true },
  documentUrl: { type: String, required: true },
  status: { type: String, default: 'Submitted', enum: ['Submitted', 'In Review', 'Approved', 'Rejected'] },
  rejectionReason: { type: String, default: null },
});

module.exports = mongoose.model('Document', documentSchema);
