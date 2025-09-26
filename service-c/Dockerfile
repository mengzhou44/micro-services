# Use a lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the application code
COPY . .

# Run the app
CMD ["node", "index.js"]
