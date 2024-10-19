// routes/userRoutes.js
const router = require('express').Router();
const { createInsUser,loginUser,verifytoken } = require('../controllers/usercontroller.js');


//const { admin } = require('../middleware/adminmiddleware.js');
//const { protect } = require('../middleware/authmiddleware.js');

// Create a new user
router.post('/register', createInsUser);

// Login as a new user
router.post('/login', loginUser);

module.exports = router;