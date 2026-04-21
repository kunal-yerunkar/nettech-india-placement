import express from 'express';
import { Record } from '../models/Record.js';
import { Lead } from '../models/Lead.js';
import { FormSchema } from '../models/FormSchema.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { authenticateToken } from '../middleware/auth.js';
import { logActivity, createActivityLog } from '../middleware/logging.js';

const router = express.Router();

router.use(authenticateToken);

// GET leads - Read logs but no activity log needed
router.get('/leads/:type', async (req, res, next) => {
  try {
    const leads = await Lead.find({ type: req.params.type }).sort({ _id: -1 });
    res.json(leads.map((l) => ({ ...l.payload, status: l.status, id: l.id, mongo_id: l._id })));
  } catch (error) {
    next(error);
  }
});

// POST records - Create/Update logs
router.post('/records/:key', logActivity('RECORD', 'UPDATE'), async (req, res, next) => {
  try {
    const { key } = req.params;
    const item = req.body;

    if (!key || !item) {
      return res.status(400).json({ message: 'Key and item data are required' });
    }

    let action = 'CREATE';
    if (item.id || item.mongo_id) {
      const query = item.mongo_id ? { _id: item.mongo_id } : { key, 'data.id': item.id };
      const existing = await Record.findOne(query);
      if (existing) action = 'UPDATE';

      await Record.findOneAndUpdate(query, { data: item }, { upsert: true });
    } else {
      const newRecord = new Record({ key, data: item });
      await newRecord.save();
    }

    // Log the action
    await createActivityLog({
      adminId: req.user?.id,
      adminUsername: req.user?.username,
      action,
      resourceType: 'RECORD',
      resourceKey: key,
      resourceId: item.id || item.mongo_id,
      changes: { after: item },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      status: 'SUCCESS',
    });

    res.json({ success: true });
  } catch (error) {
    // Log failed action
    await createActivityLog({
      adminId: req.user?.id,
      adminUsername: req.user?.username,
      action: 'UPDATE',
      resourceType: 'RECORD',
      resourceKey: req.params.key,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      status: 'FAILED',
      errorMessage: error.message,
    });
    next(error);
  }
});

// DELETE records - Delete logs
router.delete('/records/:key/:id', async (req, res, next) => {
  try {
    const { key, id } = req.params;
    if (!key || !id) {
      return res.status(400).json({ message: 'Key and ID are required' });
    }

    await Record.deleteOne({ key, 'data.id': id });

    // Log the deletion
    await createActivityLog({
      adminId: req.user?.id,
      adminUsername: req.user?.username,
      action: 'DELETE',
      resourceType: 'RECORD',
      resourceKey: key,
      resourceId: id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      status: 'SUCCESS',
    });

    res.json({ success: true });
  } catch (error) {
    // Log failed deletion
    await createActivityLog({
      adminId: req.user?.id,
      adminUsername: req.user?.username,
      action: 'DELETE',
      resourceType: 'RECORD',
      resourceKey: req.params.key,
      resourceId: req.params.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      status: 'FAILED',
      errorMessage: error.message,
    });
    next(error);
  }
});

// POST schemas - Create/Update logs
router.post('/schemas/:type', async (req, res, next) => {
  try {
    const { type } = req.params;
    const fields = req.body;

    if (!type || !fields) {
      return res.status(400).json({ message: 'Type and fields are required' });
    }

    const existing = await FormSchema.findOne({ type });
    const action = existing ? 'UPDATE' : 'CREATE';

    await FormSchema.findOneAndUpdate({ type }, { fields }, { upsert: true });

    // Log the action
    await createActivityLog({
      adminId: req.user?.id,
      adminUsername: req.user?.username,
      action,
      resourceType: 'SCHEMA',
      resourceId: type,
      changes: { after: { type, fields } },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      status: 'SUCCESS',
    });

    res.json({ success: true });
  } catch (error) {
    // Log failed action
    await createActivityLog({
      adminId: req.user?.id,
      adminUsername: req.user?.username,
      action: 'UPDATE',
      resourceType: 'SCHEMA',
      resourceId: req.params.type,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      status: 'FAILED',
      errorMessage: error.message,
    });
    next(error);
  }
});

// GET activity logs - Admin audit trail
router.get('/activity-logs', async (req, res, next) => {
  try {
    const { page = 1, limit = 50, action, resourceType, startDate, endDate } = req.query;

    const filter = {};
    if (action) filter.action = action;
    if (resourceType) filter.resourceType = resourceType;

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const logs = await ActivityLog.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await ActivityLog.countDocuments(filter);

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
