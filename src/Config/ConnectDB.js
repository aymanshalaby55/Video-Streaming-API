const prisma = require('./PrismaClient');

const connect_database = async () => {
    try {
        await prisma.$connect();
        // await prisma.video.deleteMany();
        // await prisma.user.deleteMany();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

module.exports = connect_database;