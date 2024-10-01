const express = require('express');
const router = express.Router();
// User controller functions
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../Controllers/UserController');
const { Login, SignUp, verifyEmail } = require('../Controllers/authControllers')
const { Protect, authorized, verifyEmailMiddllware } = require('../Middleware/AuthUser');
// Define routes for user operations
router.post('/login', Login);
router.post('/signUp', SignUp)

router.use(Protect);

router.post('/verifyEmail', verifyEmail)

router.use(verifyEmailMiddllware);

router.get('/getUser', getUserById);
router.post('/createUser', createUser);
router.put('/updateUser', updateUser);
router.delete('/deleteUser', deleteUser);

router.use(authorized("ADMIN"));
router.get('/getAllUser', getAllUsers);

module.exports = router;

