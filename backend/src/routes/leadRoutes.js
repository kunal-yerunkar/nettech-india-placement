import express from 'express';
import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { Lead } from '../models/Lead.js';

const router = express.Router();

// Validation middleware
const validateLeadType = param('type')
  .isIn(['student', 'partner', 'inquiry'])
  .withMessage('Invalid type. Must be one of: student, partner, inquiry');

const validateStudentLead = [
  body('fullName')
    .optional({ checkFalsy: true })
    .trim(),

  body('email')
    .optional({ checkFalsy: true })
    .trim(),

  body('phone')
    .optional({ checkFalsy: true })
    .trim(),

  body('highestQualification')
    .optional({ checkFalsy: true })
    .trim(),

  body('passingYear')
    .optional({ checkFalsy: true }),

  body('collegeName')
    .optional({ checkFalsy: true })
    .trim(),

  body('interestedDomain')
    .optional({ checkFalsy: true })
    .trim(),

  body('skills')
    .optional({ checkFalsy: true }),

  body('state')
    .optional({ checkFalsy: true })
    .trim(),

  body('city')
    .optional({ checkFalsy: true })
    .trim()
];

const validatePartnerLead = [
  body('companyName')
    .optional({ checkFalsy: true })
    .trim(),

  body('contactPerson')
    .optional({ checkFalsy: true })
    .trim(),

  body('email')
    .optional({ checkFalsy: true })
    .trim(),

  body('phone')
    .optional({ checkFalsy: true })
    .trim(),

  body('website')
    .optional({ checkFalsy: true })
    .trim()
];

const validateInquiry = [
  body('name')
    .optional({ checkFalsy: true })
    .trim(),

  body('email')
    .optional({ checkFalsy: true })
    .trim(),

  body('phone')
    .optional({ checkFalsy: true })
    .trim(),

  body('subject')
    .optional({ checkFalsy: true })
    .trim(),

  body('message')
    .optional({ checkFalsy: true })
    .trim()
];

// Dynamic middleware to apply validators based on type
const applyTypeValidators = async (req, res, next) => {
  const type = req.params.type;
  let validators = [];

  if (type === 'student') validators = validateStudentLead;
  else if (type === 'partner') validators = validatePartnerLead;
  else if (type === 'inquiry') validators = validateInquiry;

  // Run validators sequentially
  for (const validator of validators) {
    await validator.run(req);
  }

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  next();
};

// Simplified route handler - just save the data
router.post('/:type',
  validateLeadType,
  applyTypeValidators,
  async (req, res) => {
    try {
      const type = req.params.type;
      const data = req.body;

      console.log(`[LEAD ROUTE] Processing ${type} submission with data:`, Object.keys(data));

      // Check MongoDB connection
      if (!mongoose.connection.readyState) {
        console.error('[LEAD ROUTE] ❌ MongoDB not connected!');
        return res.status(503).json({ success: false, message: 'Database connection not ready' });
      }

      // Validate required data exists
      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ success: false, message: 'Form data is required' });
      }

      // Check for duplicate student registrations by email or phone
      if (type === 'student' && (data.email || data.phone)) {
        const orConditions = [];
        if (data.email) orConditions.push({ 'payload.email': data.email });
        if (data.phone) orConditions.push({ 'payload.phone': data.phone });

        if (orConditions.length > 0) {
          const existing = await Lead.findOne({
            type: 'student',
            $or: orConditions
          });
          if (existing) {
            return res.status(400).json({ success: false, message: 'This email or phone is already registered' });
          }
        }
      }

      // Create and save the lead
      const leadId = `NT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      console.log(`[LEAD ROUTE] Creating lead object with ID: ${leadId}`);

      const leadPayload = {
        type,
        id: leadId,
        status: 'Pending',
        timestamp: new Date().toLocaleString(),
        payload: data
      };

      console.log(`[LEAD ROUTE] Lead payload:`, JSON.stringify(leadPayload, null, 2));

      const newLead = new Lead(leadPayload);

      console.log(`[LEAD ROUTE] Lead object created, attempting to save...`);
      console.log(`[LEAD ROUTE] MongoDB connection state: ${mongoose.connection.readyState}`);

      try {
        const savedLead = await newLead.save();
        console.log(`[LEAD ROUTE] Save operation completed`);
        console.log(`[LEAD ROUTE] Saved document ID: ${savedLead._id}`);
        console.log(`[LEAD ROUTE] Saved document custom ID: ${savedLead.id}`);

        // Verify document was actually written to database
        const verification = await Lead.findById(savedLead._id);
        if (verification) {
          console.log(`[LEAD ROUTE] ✅ VERIFIED: Document exists in database!`);
          res.json({ success: true, id: savedLead.id });
        } else {
          console.error(`[LEAD ROUTE] ❌ VERIFICATION FAILED: Document not found after save!`);
          res.status(500).json({ success: false, message: 'Document save verification failed' });
        }
      } catch (saveError) {
        console.error(`[LEAD ROUTE] ❌ Save error:`, saveError.message);
        console.error(`[LEAD ROUTE] Save error code:`, saveError.code);
        console.error(`[LEAD ROUTE] Save error name:`, saveError.name);
        console.error(`[LEAD ROUTE] Full error:`, JSON.stringify(saveError, null, 2));
        throw saveError;
      }

    } catch (error) {
      console.error(`[LEAD ROUTE] ❌ Fatal error:`, error.message);
      console.error(`[LEAD ROUTE] Error code:`, error.code);
      console.error(`[LEAD ROUTE] Error name:`, error.name);
      console.error(`[LEAD ROUTE] Error stack:`, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default router;
