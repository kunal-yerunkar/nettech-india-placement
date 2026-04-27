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

// Simplified route handler - just save the data
router.post('/:type',
  validateLeadType,
  (req, res, next) => {
    const type = req.params.type;

    // Apply appropriate validators based on type
    let validators = [];
    if (type === 'student') validators = validateStudentLead;
    else if (type === 'partner') validators = validatePartnerLead;
    else if (type === 'inquiry') validators = validateInquiry;

    // Execute validators
    return Promise.all(validators.map(validator => validator.run(req)))
      .then(() => next())
      .catch(next);
  },
  async (req, res, next) => {
    try {
      const type = req.params.type;
      const data = req.body;

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

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

      const newLead = new Lead({
        type,
        id: leadId,
        status: 'Pending',
        timestamp: new Date().toLocaleString(),
        payload: data
      });

      console.log(`[LEAD ROUTE] Lead object created, attempting to save...`);

      const savedLead = await newLead.save();
      console.log(`[LEAD ROUTE] ✅ ${type} lead saved successfully! ID: ${savedLead.id}`);
      res.json({ success: true, id: savedLead.id });

    } catch (error) {
      console.error(`[LEAD ROUTE] ❌ Fatal error:`, error.message);
      console.error(`[LEAD ROUTE] Error code:`, error.code);
      console.error(`[LEAD ROUTE] Error name:`, error.name);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default router;
