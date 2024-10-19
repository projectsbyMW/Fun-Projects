const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    name:{ type: String, required: true, unique: true},
    email:{ type: String, required: true, unique: true},
    phone:{type: Number, required: true, min: 10},
    password:{type: String, required: true},
    kycStatus: { type: String, default: 'Pending', enum: ['Submitted', 'Pending', 'Approved', 'Rejected'] },
    docStatus: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
    policyStatus: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
    notifications: [{
        message: { type: String },
        type: { type: String, enum: ['KYC', 'Document', 'Policy'] },
        createdAt: { type: Date, default: Date.now }
      }]
}, {
    timestamps: true,
});

module.exports = mongoose.model('employees', EmployeeSchema);