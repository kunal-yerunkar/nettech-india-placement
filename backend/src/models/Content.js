import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }
});

export const Content = mongoose.model('Content', contentSchema);
