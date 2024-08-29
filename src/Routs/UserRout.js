const express = require('express');
const router = express.Router();
// User controller functions
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../Controllers/UserController');
const { Login, SignUp } = require('../Controllers/authControllers')
const { Protect } = require('../Middleware/AuthUser');
// Define routes for user operations
router.post('/Login', Login);
router.post('/SignUp', SignUp)


router.get('/GetAllUser', getAllUsers);
router.get('/GetUser/:id', getUserById);
router.post('/CreateUser', createUser);
router.put('/UpdateUser/:id', updateUser);
router.delete('/DeleteUser/:id', deleteUser);

module.exports = router;

