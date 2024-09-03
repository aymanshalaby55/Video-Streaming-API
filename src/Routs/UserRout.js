const express = require('express');
const router = express.Router();
// User controller functions
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../Controllers/UserController');
const { Login, SignUp, verifyEmail } = require('../Controllers/authControllers')
const { Protect, authorized, verifyEmailMiddllware } = require('../Middleware/AuthUser');
// Define routes for user operations
router.post('/Login', Login);
router.post('/SignUp', SignUp)

router.use(Protect);

router.post('/verifyEmail', verifyEmail)

router.use(verifyEmailMiddllware);

router.get('/GetUser', getUserById);
router.post('/CreateUser', createUser);
router.put('/UpdateUser', updateUser);
router.delete('/DeleteUser', deleteUser);

router.use(authorized("ADMIN"));
router.get('/GetAllUser', getAllUsers);

module.exports = router;

