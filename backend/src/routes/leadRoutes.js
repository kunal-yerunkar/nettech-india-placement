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
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .isEmail().withMessage('Valid email address is required')
    .normalizeEmail(),

  body('phone')
    .trim()
    .custom(val => {
      if (!val) return false; // Required for student
      // Clean phone number and validate
      const cleanedPhone = val.replace(/[\s\-\(\)\+]/g, '');
      const phoneRegex = /^[0-9]{10,15}$/;
      return phoneRegex.test(cleanedPhone);
    })
    .withMessage('Valid phone number required (10-15 digits)'),

  body('highestQualification')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Qualification must be 100 characters or less'),

  body('passingYear')
    .optional()
    .isInt({ min: 1950, max: new Date().getFullYear() })
    .withMessage('Invalid passing year'),

  body('collegeName')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('College name must be 200 characters or less'),

  body('interestedDomain')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Domain must be 100 characters or less'),

  body('skills')
    .optional()
    .custom(val => {
      // Accept either string or array
      if (typeof val === 'string') return true; // "Python, Java" is valid
      if (Array.isArray(val)) {
        return val.every(s => typeof s === 'string' && s.length > 0 && s.length <= 100);
      }
      return false;
    })
    .withMessage('Skills must be a string or array of strings')
];

const validatePartnerLead = [
  body('companyName')
    .trim()
    .notEmpty().withMessage('Company name is required')
    .isLength({ min: 2, max: 200 }).withMessage('Company name must be between 2 and 200 characters'),

  body('contactPerson')
    .trim()
    .notEmpty().withMessage('Contact person name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Contact person must be between 2 and 100 characters'),

  body('email')
    .trim()
    .isEmail().withMessage('Valid email address is required')
    .normalizeEmail(),

  body('phone')
    .trim()
    .custom(val => {
      if (!val) return false; // Required for partner
      // Clean phone number and validate
      const cleanedPhone = val.replace(/[\s\-\(\)\+]/g, '');
      const phoneRegex = /^[0-9]{10,15}$/;
      return phoneRegex.test(cleanedPhone);
    })
    .withMessage('Valid phone number required (10-15 digits)'),

  body('website')
    .optional()
    .trim()
    .isURL().withMessage('Valid website URL is required')
];

const validateInquiry = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .isEmail().withMessage('Valid email address is required')
    .normalizeEmail(),

  body('phone')
    .optional()
    .trim()
    .custom(val => {
      if (!val || val === '') return true; // Optional, so empty is ok
      // Accept: pure digits (10-15), or formatted with dashes/parentheses/spaces/plus
      const cleanedPhone = val.replace(/[\s\-\(\)\+]/g, '');
      const phoneRegex = /^[0-9]{10,15}$/;
      return phoneRegex.test(cleanedPhone);
    })
    .withMessage('Valid phone number is required (10-15 digits)'),

  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters'),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters')
];

// Validation handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('[VALIDATION ERROR]', errors.array());
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({ field: err.param, message: err.msg }))
    });
  }
  next();
};

// Dynamic route handler that applies correct validation based on type
router.post('/:type', validateLeadType, async (req, res, next) => {
  const type = req.params.type;

  console.log(`[LEAD ROUTE] Processing ${type} submission`);

  // Choose validation based on type
  let validationMiddlewares = [];
  if (type === 'student') {
    validationMiddlewares = validateStudentLead;
  } else if (type === 'partner') {
    validationMiddlewares = validatePartnerLead;
  } else if (type === 'inquiry') {
    validationMiddlewares = validateInquiry;
  }

  // Run all validators
  await Promise.all(
    validationMiddlewares.map(validator => validator.run(req))
  );

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error(`[VALIDATION ERROR] ${type}:`, errors.array());
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({ field: err.param, message: err.msg }))
    });
  }

  // All validations passed, proceed to save
  await handleLeadSubmission(req, res, next);
});

async function handleLeadSubmission(req, res, next) {
  try {
    const { type } = req.params;
    const data = req.body;

    console.log(`[LEAD SUBMISSION] Type: ${type}, Data keys:`, Object.keys(data));

    // Validate type
    const validTypes = ['student', 'partner', 'inquiry'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: `Invalid type. Must be one of: ${validTypes.join(', ')}` });
    }

    // Validate required data
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ message: 'Request body is required' });
    }

    // Check for duplicate student registrations
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

    console.log(`[LEAD SUBMISSION] Saving lead with ID: ${newLead.id}`);
    await newLead.save();
    console.log(`[LEAD SUBMISSION] ✅ Lead saved successfully: ${newLead.id}`);
    res.json({ success: true, id: newLead.id });
  } catch (error) {
    console.error(`[LEAD SUBMISSION] ❌ Error saving lead:`, error.message);
    next(error);
  }
}

export default router;
