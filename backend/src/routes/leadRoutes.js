import express from 'express';
import { Lead } from '../models/Lead.js';

const router = express.Router();

router.post('/:type', async (req, res, next) => {
  try {
    const { type } = req.params;
    const data = req.body;

    // Validate type
    const validTypes = ['student', 'partner', 'inquiry'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: `Invalid type. Must be one of: ${validTypes.join(', ')}` });
    }

    // Validate required data
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ message: 'Request body is required' });
    }

    if (type === 'student') {
      const existing = await Lead.findOne({
        type: 'student',
        $or: [{ 'payload.email': data.email }, { 'payload.phone': data.phone }]
      });
      if (existing) {
        return res.status(400).json({ message: 'Identity already registered in deployment queue.' });
      }
    }

    const newLead = new Lead({
      type,
      id: data.id || `NT-${Date.now()}`,
      status: 'Pending',
      timestamp: new Date().toLocaleString(),
      payload: data
    });

    await newLead.save();
    res.json({ success: true, id: newLead.id });
  } catch (error) {
    next(error);
  }
});

export default router;
