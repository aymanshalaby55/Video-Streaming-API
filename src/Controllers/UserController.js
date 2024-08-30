const prisma = require('../Config/PrismaClient');
const catchAsync = require('express-async-handler');
const AppError = require('../utils/appError');

// Get all users
const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await prisma.user.findMany({
        include: {
            videos: true
        }
    });
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

// Get user by ID
const getUserById = catchAsync(async (req, res, next) => {
    const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        include: {
            videos: true
        }
    });
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

// Create a new user
const createUser = catchAsync(async (req, res, next) => {
    const { username, email, password, role } = req.body;
    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password,
            role,
        }
    });
    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    });
});

// Update user by ID
const updateUser = catchAsync(async (req, res, next) => {
    const user = await prisma.user.update({
        where: { id: Number(req.params.id) },
        data: req.body
    });
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

// Delete user by ID
const deleteUser = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    await prisma.user.delete({
        where: { id: id }
    });

    res.status(204).send({
        status: 'success',
        message: `User with ID ${id} has been deleted`
    });
});

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
