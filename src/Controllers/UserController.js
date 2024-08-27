const prisma = require('../Config/PrismaClient');

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(req.params.id) },
        });
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Create a new user
const createUser = async (req, res) => {
    try {
        await prisma.user.deleteMany();
        const { username, email, password, role, isPremium } = req.body;
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
    } catch (err) {
        console.error(err);
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Update user by ID
const updateUser = async (req, res) => {
    try {
        const user = await prisma.user.update({
            where: { id: Number(req.params.id) },
            data: req.body
        });
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Delete user by ID
const deleteUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma.user.delete({
            where: { id: id }
        });

        res.status(204).send({
            status: 'success',
            message: `User with ID ${id} has been deleted`
        });
    } catch (err) {
        if (err.code === 'P2025') {
            // Prisma error code for record not found
            res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        } else {
            console.error(err);
            res.status(500).json({
                status: 'error',
                message: 'An error occurred while deleting the user'
            });
        }
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
