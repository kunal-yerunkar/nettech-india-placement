import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  key: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  timestamp: { type: Date, default: Date.now }
});

recordSchema.index({ key: 1 });
recordSchema.index({ key: 1, 'data.id': 1 });

export const Record = mongoose.model('Record', recordSchema);
