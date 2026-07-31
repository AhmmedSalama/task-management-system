const express = require('express');
const { body, param, query } = require('express-validator');

const {
  createTask,
  getTasks,
  getTasksByProject,
  updateTaskStatus,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');

const router = express.Router();

router.use(protect);

// =========================================
// Create Task
// =========================================

router.post(
  '/',
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Task title is required'),

    body('projectId')
      .isMongoId()
      .withMessage('Invalid project id'),

    body('description')
      .optional()
      .trim(),

    body('priority')
      .optional()
      .isIn(['Low', 'Medium', 'High'])
      .withMessage('Invalid priority'),

    body('status')
      .optional()
      .isIn(['To Do', 'In Progress', 'Done'])
      .withMessage('Invalid status'),

    body('assignee')
      .optional({ nullable: true })
      .isMongoId()
      .withMessage('Invalid assignee id'),

    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid due date'),
  ],
  validate,
  createTask
);

// =========================================
// Get All Tasks
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

    query('status')
      .optional()
      .isIn(['To Do', 'In Progress', 'Done'])
      .withMessage('Invalid status'),

    query('priority')
      .optional()
      .isIn(['Low', 'Medium', 'High'])
      .withMessage('Invalid priority'),

    query('assignee')
      .optional()
      .isMongoId()
      .withMessage('Invalid assignee id'),

    query('projectId')
      .optional()
      .isMongoId()
      .withMessage('Invalid project id'),

    query('search')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Search cannot exceed 100 characters'),

    query('sortBy')
      .optional()
      .isIn([
        'title',
        'priority',
        'status',
        'dueDate',
        'createdAt',
      ])
      .withMessage('Invalid sort field'),

    query('order')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Order must be asc or desc'),
  ],
  validate,
  getTasks
);

// =========================================
// Get Tasks By Project
// =========================================

router.get(
  '/:projectId',
  [
    param('projectId')
      .isMongoId()
      .withMessage('Invalid project id'),

    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive number'),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),

    query('status')
      .optional()
      .isIn(['To Do', 'In Progress', 'Done'])
      .withMessage('Invalid status'),

    query('priority')
      .optional()
      .isIn(['Low', 'Medium', 'High'])
      .withMessage('Invalid priority'),

    query('assignee')
      .optional()
      .isMongoId()
      .withMessage('Invalid assignee id'),

    query('search')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Search cannot exceed 100 characters'),

    query('sortBy')
      .optional()
      .isIn([
        'title',
        'priority',
        'status',
        'dueDate',
        'createdAt',
      ])
      .withMessage('Invalid sort field'),

    query('order')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Order must be asc or desc'),
  ],
  validate,
  getTasksByProject
);

// =========================================
// Update Task Status
// =========================================

router.put(
  '/:id/status',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid task id'),

    body('status')
      .isIn(['To Do', 'In Progress', 'Done'])
      .withMessage('Invalid status'),
  ],
  validate,
  updateTaskStatus
);

// =========================================
// Update Task
// =========================================

router.put(
  '/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid task id'),

    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty'),

    body('description')
      .optional()
      .trim(),

    body('priority')
      .optional()
      .isIn(['Low', 'Medium', 'High'])
      .withMessage('Invalid priority'),

    body('status')
      .optional()
      .isIn(['To Do', 'In Progress', 'Done'])
      .withMessage('Invalid status'),

    body('assignee')
      .optional({ nullable: true })
      .custom((value) => {
        if (value === '') return true;
        return /^[0-9a-fA-F]{24}$/.test(value);
      })
      .withMessage('Invalid assignee id'),

    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid due date'),
  ],
  validate,
  updateTask
);

// =========================================
// Delete Task
// =========================================

router.delete(
  '/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid task id'),
  ],
  validate,
  deleteTask
);

module.exports = router;