const express = require('express');
const { body } = require('express-validator');

const {
  register,
  login,
  getMe,
} = require('../controllers/authController');

const validate = require('../middlewares/validateMiddleware');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 100 })
      .withMessage('Name cannot exceed 100 characters'),

    body('email')
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Please provide a valid email'),

    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email')
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Please provide a valid email'),

    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  validate,
  login
);

router.get('/me', protect, getMe);

module.exports = router;