const express = require('express');
const router = express.Router();

// Import the Controller
const {
  getAllDishes,
  createDish,
  getDishById,
  updateDish,
  deleteDish,
} = require('../controllers/dishController');

// Import controllers here...
const { protect, authorize } = require('../middleware/authMiddleware');

const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

// 1. If user goes to GET / (Show menu) → Ask Chef to getAllDishes
router.get('/dishes', getAllDishes);

// 3. If user goes to GET /:id (Ask for specific meal) → Ask Chef to getDishById
router.get('/dishes/:id', getDishById); // Get the chef details for a specific dish

// ONLY Admins and Managers can create dishes
router.post('/dishes', protect, authorize('admin', 'manager'), createDish);


// 4. If user sends PUT /:id (Change meal) → Ask Chef to updateDish
router.put('/dishes/:id', updateDish);

// 5. If user sends DELETE /:id (Cancel meal) → Ask Chef to deleteDish
router.delete('/dishes/:id', deleteDish);

module.exports = router;
