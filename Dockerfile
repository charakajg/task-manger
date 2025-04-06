FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript code
RUN npm run build || echo "Initial build"

# Expose ports
EXPOSE 3000 8080

# Command to start the app is defined in docker-compose.yml