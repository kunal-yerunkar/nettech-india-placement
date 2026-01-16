import express from 'express';
import { Record } from '../models/Record.js';
import { Lead } from '../models/Lead.js';
import { FormSchema } from '../models/FormSchema.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/leads/:type', async (req, res, next) => {
  try {
    const leads = await Lead.find({ type: req.params.type }).sort({ _id: -1 });
    res.json(leads.map((l) => ({ ...l.payload, status: l.status, id: l.id, mongo_id: l._id })));
  } catch (error) {
    next(error);
  }
});

router.post('/records/:key', async (req, res, next) => {
  try {
    const { key } = req.params;
    const item = req.body;

    if (!key || !item) {
      return res.status(400).json({ message: 'Key and item data are required' });
    }

    if (item.id || item.mongo_id) {
      const query = item.mongo_id ? { _id: item.mongo_id } : { key, 'data.id': item.id };
      await Record.findOneAndUpdate(query, { data: item }, { upsert: true });
    } else {
      const newRecord = new Record({ key, data: item });
      await newRecord.save();
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.delete('/records/:key/:id', async (req, res, next) => {
  try {
    const { key, id } = req.params;
    if (!key || !id) {
      return res.status(400).json({ message: 'Key and ID are required' });
    }
    await Record.deleteOne({ key, 'data.id': id });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post('/schemas/:type', async (req, res, next) => {
  try {
    const { type } = req.params;
    const fields = req.body;
    
    if (!type || !fields) {
      return res.status(400).json({ message: 'Type and fields are required' });
    }

    await FormSchema.findOneAndUpdate({ type }, { fields }, { upsert: true });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
