# Use the official Node.js image as the base image
# Choose a slim image to reduce size and specify the Node.js version
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Install only production dependencies to reduce image size
RUN npm ci --only=production

# Expose the Next.js app port
EXPOSE 3000

# Use a smaller base image for production
FROM node:18-alpine AS runner

# Set the working directory
WORKDIR /app

# Copy the build output and production dependencies from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Set the environment to production
ENV NODE_ENV=production

# Expose the application port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]