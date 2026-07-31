const express = require('express');
const { body, param, query } = require('express-validator');

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/projectController');

const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');

const router = express.Router();

router.use(protect);

// =========================================
// Get Projects
// =========================================

router.get(
  '/',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive number'),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),

    query('search')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Search cannot exceed 100 characters'),

    query('sortBy')
      .optional()
      .isIn(['name', 'createdAt'])
      .withMessage('Invalid sort field'),

    query('order')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Order must be asc or desc'),
  ],
  validate,
  getProjects
);

router.get(
  '/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid project id'),
  ],
  validate,
  getProjectById
);

// =========================================
// Create Project
// =========================================

router.post(
  '/',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Project name is required')
      .isLength({ max: 100 })
      .withMessage('Project name cannot exceed 100 characters'),

    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),

    body('members')
      .optional()
      .isArray()
      .withMessage('Members must be an array'),

    body('members.*')
      .optional()
      .isMongoId()
      .withMessage('Invalid member id'),
  ],
  validate,
  createProject
);

// =========================================
// Update Project
// =========================================

router.put(
  '/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid project id'),

    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Project name cannot be empty')
      .isLength({ max: 100 })
      .withMessage('Project name cannot exceed 100 characters'),

    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
  ],
  validate,
  updateProject
);

// =========================================
// Delete Project
// =========================================

router.delete(
  '/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid project id'),
  ],
  validate,
  deleteProject
);

// =========================================
// Add Member
// =========================================

router.post(
  '/:id/members',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid project id'),

    body('userId')
      .optional()
      .isMongoId()
      .withMessage('Invalid user id'),

    body('email')
      .optional()
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Invalid email'),

    body().custom((value) => {
      if (!value.userId && !value.email) {
        throw new Error('User id or email is required');
      }
      return true;
    }),
  ],
  validate,
  addMember
);

// =========================================
// Remove Member
// =========================================

router.delete(
  '/:id/members/:userId',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid project id'),

    param('userId')
      .isMongoId()
      .withMessage('Invalid user id'),
  ],
  validate,
  removeMember
);

module.exports = router;