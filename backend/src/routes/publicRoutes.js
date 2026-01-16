import express from 'express';
import { Record } from '../models/Record.js';
import { Content } from '../models/Content.js';
import { FormSchema } from '../models/FormSchema.js';

const router = express.Router();

router.get('/records/:key', async (req, res, next) => {
  try {
    const records = await Record.find({ key: req.params.key });
    res.json(records.map((r) => ({ ...r.data, mongo_id: r._id })));
  } catch (error) {
    next(error);
  }
});

router.get('/content/:key', async (req, res, next) => {
  try {
    const content = await Content.findOne({ key: req.params.key });
    res.json(content ? content.data : []);
  } catch (error) {
    next(error);
  }
});

router.get('/schemas/:type', async (req, res, next) => {
  try {
    const schema = await FormSchema.findOne({ type: req.params.type });
    res.json(schema ? schema.fields : []);
  } catch (error) {
    next(error);
  }
});

export default router;
