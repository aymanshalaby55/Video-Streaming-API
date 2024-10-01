# Video Sharing Platform Backend

This is the backend server for a video sharing platform, built with Node.js, Express, and PostgreSQL with Prisma ORM.


## How to Run with Docker Compose

To run the application using Docker Compose, use the following command:
1. Make sure you have Docker and Docker Compose installed on your system.

2. Clone the repository:
   ```
   git clone https://github.com/aymanshalaby55/Video-Streaming
   ```

3. update `.env` file in the root directory and with necessary environment variables:

4. Run the following command to start the application:
   ```
   docker-compose up --build
   ```

This command will build the Docker images and start the containers for both the Node.js application and the PostgreSQL database.


5. The application should now be running and accessible at `http://localhost:3000`.

Note: Make sure to update the `DATABASE_URL` in the `docker-compose.yml` file to match your database configuration if needed.



## Features

- User authentication (signup, login, email verification)
- otp verifcation with email
- Video upload and management
- Comment system
- Favorite videos functionality
- Role-based access control (User and Admin roles)
- Rate limiting to prevent DoS attacks
- API documentation with Swagger

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JSON Web Tokens (JWT) for authentication
- Joi for input validation
- Swagger for API documentation
- docker

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your PostgreSQL database
4. Create a `.env` file and add your database URL and other environment variables
5. Run database migrations: `npx prisma migrate dev`
6. Start the server: `npm start`

## API Routes

- `/api/users`: User-related operations
- `/api/videos`: Video-related operations
- `/api/comments`: Comment-related operations

For detailed API documentation, visit `/api-docs` when the server is running.

## Security Features

- Helmet.js for setting security headers
- Rate limiting to prevent abuse
- Password hashing
- CORS configuration

## Database Schema

The database includes models for:
- Users
- Videos
- Comments
- Favorite Videos

Refer to `prisma/schema.prisma` for detailed schema information.

![Database Schema](./db_schema.png)

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
