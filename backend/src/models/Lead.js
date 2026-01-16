import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  type: { type: String, enum: ['student', 'partner', 'inquiry'], required: true },
  id: { type: String, required: true, unique: true },
  status: { type: String, default: 'Pending' },
  timestamp: { type: String },
  payload: { type: mongoose.Schema.Types.Mixed, required: true }
});

leadSchema.index({ type: 1, status: 1 });
leadSchema.index({ type: 1, 'payload.email': 1 });
leadSchema.index({ type: 1, 'payload.phone': 1 });
leadSchema.index({ 'payload.fullName': 'text', 'payload.companyName': 'text' });

export const Lead = mongoose.model('Lead', leadSchema);
