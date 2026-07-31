const express = require('express');

const {
  protect,
  restrictTo,
} = require('../middlewares/authMiddleware');

const {
  getUsers,
  getUserDetailsForAdmin,
} = require('../controllers/userController');

const router = express.Router();

router.use(protect);

router.get(
  '/',
  restrictTo('Admin'),
  getUsers
);

router.get(
  '/:id/details',
  restrictTo('Admin'),
  getUserDetailsForAdmin
);

module.exports = router;