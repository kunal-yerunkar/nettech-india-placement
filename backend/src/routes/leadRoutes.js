import express from 'express';
import { body, param, validationResult } from 'express-validator';
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
router.post('/:type', validateLeadType, async (req, res, next) => {
  try {
    const type = req.params.type;
    const data = req.body;

    console.log(`[LEAD ROUTE] Processing ${type} submission with data:`, Object.keys(data));

    // Validate type
    const validTypes = ['student', 'partner', 'inquiry'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid submission type' });
    }

    // Validate required data exists
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ success: false, message: 'Form data is required' });
    }

    // Check for duplicate student registrations by email or phone
    if (type === 'student' && (data.email || data.phone)) {
      const existing = await Lead.findOne({
        type: 'student',
        $or: [
          data.email && { 'payload.email': data.email },
          data.phone && { 'payload.phone': data.phone }
        ].filter(Boolean)
      });
      if (existing) {
        return res.status(400).json({ success: false, message: 'This email or phone is already registered' });
      }
    }

    // Create and save the lead
    const newLead = new Lead({
      type,
      id: data.id || `NT-${Date.now()}`,
      status: 'Pending',
      timestamp: new Date().toLocaleString(),
      payload: data
    });

    await newLead.save();
    console.log(`[LEAD ROUTE] ✅ ${type} lead saved: ${newLead.id}`);

    res.json({ success: true, id: newLead.id });
  } catch (error) {
    console.error(`[LEAD ROUTE] ❌ Error:`, error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
