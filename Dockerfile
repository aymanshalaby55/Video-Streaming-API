# Use an official Node.js runtime as the base image
FROM node:18

# Install ffmpeg system package (optional but can help)
RUN apt-get update && apt-get install -y ffmpeg

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Rebuild the @ffmpeg-installer/ffmpeg package to ensure correct binary is used
RUN npm rebuild @ffmpeg-installer/ffmpeg

# Copy the rest of the application code
COPY . .

# Run Prisma migrations and generate Prisma client

# Expose the app's port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "div"]
