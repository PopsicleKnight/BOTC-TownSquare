# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./
COPY . .

# Copy only the necessary files (src and server directories)
# COPY src ./src
# COPY server ./server

# If you have any environment or config files needed, copy those too
# COPY .env ./


# Install the dependencies
RUN npm install

# Build the application
RUN npm run build

# Expose the ports the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "run", "start"]