// routes/userRoutes.js
const router = require('express').Router();
const { getDocuments,
    updateDocumentStatus,
    getEmployees,
    getEmployeesById,
    updatePolicyStatus
} = require('../controllers/admincontroller.js');


//const { admin } = require('../middleware/adminmiddleware.js');
//const { protect } = require('../middleware/authmiddleware.js');

// Route to fetch all documents
router.get('/documents', getDocuments);

// Route to update a document's status
router.put('/documents/:id', updateDocumentStatus);

router.get('/employees', getEmployees);

router.get('/employees/:id', getEmployeesById);

router.put('/employees/:id/policy', updatePolicyStatus);


// Update user status
//router.patch('/:id/status', updateUserStatus);

module.exports = router;