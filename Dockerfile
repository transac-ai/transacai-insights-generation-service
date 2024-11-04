# First stage: Build the application
FROM node:23-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm run build

# Second stage: Run the application
FROM node:23-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to install production dependencies
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install only production dependencies
RUN pnpm install --prod

# Copy only the built 'lib' folder from the builder stage
COPY --from=builder /app/lib ./lib

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD ["node", "lib/index.js"]